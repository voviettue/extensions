import axios from 'axios';
import { Query } from '../types';
import { SchemaOverview, Accountability, ApiExtensionContext } from '@directus/shared/types';
import { BaseException } from '@directus/shared/exceptions';

type CallbackFunction = 'executeItems' | 'executeApi';

export class QueryService {
	schema: SchemaOverview;
	accountability: Accountability;
	ctx: ApiExtensionContext;
	activityService: any;
	queryItemsService: any;
	callback = {
		items: 'executeItems',
		api: 'executeApi',
		json: '',
	};

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

	async execute(queryId: number) {
		try {
			const query: Query = await this.queryItemsService.readOne(queryId, { fields: '*' });
			const callbackName = this.callback[query.query] as CallbackFunction;
			const data = await this[callbackName](query);
			return data;
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

			const data = await itemsService.readByQuery({
				filter: query.options?.filter,
				fields: query.options.fields,
				limit: query.options?.per_page || 20,
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
			query.options?.headers?.map((e: any) => (headers[e.key] = e.value));

			const params: Record<string, any> = {};
			query.options?.query?.map((e: any) => (params[e.key] = e.value));

			const body = query.options?.request_body;

			const options = {
				method: query.options.method,
				url: query.options.url,
				params: params,
				data: body,
				headers: headers,
				timeout: query.timeout,
			};

			const { data } = await axios(options);

			return data;
		} catch (e: any) {
			const message = (e.response.data.errors && e.response.data.errors[0]?.message) || e.response.data.message || '';
			const statusCode = e.response.status;
			throw new BaseException(message, statusCode, e?.code);
		}
	}
}
