import axios from 'axios';
import { Query } from '../types';
import { SchemaOverview, Accountability, ApiExtensionContext } from '@directus/shared/types';
import { BaseException } from '@directus/shared/exceptions';
import isJson from '../utils/is-json';
import renderTemplate from '../utils/render-template';

export class QueryService {
	schema: SchemaOverview;
	accountability: Accountability;
	ctx: ApiExtensionContext;
	activityService: any;
	queryItemsService: any;
	handlers = {
		item: 'executeItem',
		items: 'executeItems',
		api: 'executeApi',
	};
	params: any;

	constructor(schema: SchemaOverview, accountability: Accountability, ctx: ApiExtensionContext) {
		this.schema = schema;
		this.accountability = accountability;
		this.ctx = ctx;

		this.activityService = new ctx.services.ItemsService('directus_activity', {
			schema: this.schema,
			accountability: this.accountability,
		});

		this.queryItemsService = new ctx.services.ItemsService('cms_queries', {
			schema: this.schema,
			accountability: this.accountability,
		});
	}

	async execute(queryId: number, params: any = {}) {
		try {
			this.params = {};
			const query: Query = await this.queryItemsService.readOne(queryId);
			const queryParams: any[] = query.params ?? [];
			for (const param of queryParams) {
				this.params[param?.name] = param?.value ?? null;
			}
			this.params = { ...this.params, ...params };
			// if (this.handlers?.[query.query]) {

			// }
			const fn = this.handlers?.[query.query];
			if (!fn) return query.output;

			return await this[fn](query);
		} catch (e: any) {
			throw new BaseException(e?.message, e?.status, e?.code);
		}
	}

	async createLog(queryId: number, log: any, error: any) {
		const query: Query = await this.queryItemsService.readOne(queryId, { fields: '*' });

		await this.activityService.createOne({
			action: 'execute',
			user: this.accountability!.user,
			collection: query?.options?.collection || '',
			ip: this.accountability!.ip,
			user_agent: this.accountability!.userAgent,
			item: query.id,
			comment: {
				message: `[${query.name}] Execution started from user request`,
				data: log,
				error: error,
				type: query.query,
				name: query.name,
			},
		});
	}

	async executeItem(query: Query) {
		const { InvalidPayloadException } = this.ctx.exceptions;
		const { ItemsService } = this.ctx.services;

		try {
			if (!query?.options?.collection || !query?.options?.primaryValue) {
				throw new InvalidPayloadException('invalid params');
			}

			const itemsService = new ItemsService(query.options.collection, {
				schema: this.schema,
				accountability: this.accountability,
			});

			const primaryValue = renderTemplate(query.options.primaryValue, this.params);
			const data = await itemsService.readOne(primaryValue, {
				fields: query.options?.fields && query.options.fields.length ? query.options.fields : '*',
			});

			return data;
		} catch (e: any) {
			throw new InvalidPayloadException(e?.message);
		}
	}

	async executeItems(query: Query) {
		const { InvalidPayloadException } = this.ctx.exceptions;
		const { ItemsService } = this.ctx.services;

		try {
			if (!query?.options?.collection || !query?.options?.fields) {
				throw new InvalidPayloadException('invalid params');
			}

			const itemsService = new ItemsService(query.options.collection, {
				schema: this.schema,
				accountability: this.accountability,
			});

			const filter = JSON.parse(renderTemplate(JSON.stringify(query.options?.filter), this.params)) ?? null;
			const limit = parseInt(renderTemplate(query.options?.perPage, this.params)) || 20;
			const data = await itemsService.readByQuery({
				fields: query.options?.fields && query.options.fields.length ? query.options.fields : '*',
				filter: filter,
				limit: isNaN(limit) ? null : limit,
			});

			return data;
		} catch (e: any) {
			throw new InvalidPayloadException(e?.message);
		}
	}

	async executeApi(query: Query): Promise<Record<string, any>> {
		const { InvalidPayloadException } = this.ctx.exceptions;

		try {
			if (!query.options?.method || !query.options?.url) {
				throw new InvalidPayloadException('Invalid params');
			}

			const headers: Record<string, any> = {};
			const params: Record<string, any> = {};

			query.options?.headers?.map((e: any) => (headers[e.key] = renderTemplate(e.value, this.params)));
			query.options?.params?.map((e: any) => {
				const value = renderTemplate(e.value, this.params);
				params[e.key] = isJson(value) ? JSON.parse(value) : value;
			});

			const body = renderTemplate(query.options?.data, this.params) ?? null;
			const url = renderTemplate(query.options.url, this.params) ?? null;

			const options = {
				method: query.options.method,
				url: url,
				params: params,
				data: body,
				headers: headers,
				timeout: query.timeout,
			};

			const { data } = await axios(options);

			return data;
		} catch (e: any) {
			const message =
				(e?.response?.data?.errors && e?.response?.data?.errors[0]?.message) || e?.response?.data?.message || '';
			const statusCode = e.response.status;
			throw new BaseException(message, statusCode, e?.code);
		}
	}
}
