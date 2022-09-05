import axios from 'axios';
import { Query } from '../types';
import { SchemaOverview, Accountability, ApiExtensionContext } from '@directus/shared/types';
import { BaseException } from '@directus/shared/exceptions';

type CallbackFunction = 'executeItems' | 'executeApi';

export class QueryService {
	query: Query;
	schema: SchemaOverview;
	accountability: Accountability;
	ctx: ApiExtensionContext;
	callback: any;
	activityService: any;

	constructor(query: Query, schema: SchemaOverview, accountability: Accountability, ctx: ApiExtensionContext) {
		this.query = query;
		this.schema = schema;
		this.accountability = accountability;
		this.ctx = ctx;
		this.activityService = new ctx.services.ItemsService('directus_activity', {
			schema: this.schema,
			accountability: this.accountability,
		});
		this.callback = {
			items: 'executeItems',
			api: 'executeApi',
		};
	}

	async execute() {
		try {
			const callbackName: CallbackFunction = this.callback[this.query.query];
			const data = await this[callbackName]();
			return data;
		} catch (e: any) {
			throw new BaseException(e?.message, e?.status, e?.code);
		}
	}

	async createLog(data: any, error: any) {
		await this.activityService.createOne({
			action: 'execute',
			user: this.accountability!.user,
			collection: this.query?.options?.collection || '',
			ip: this.accountability!.ip,
			user_agent: this.accountability!.userAgent,
			item: this.query.id,
			comment: {
				message: `[${this.query.name}] Execution started from user request`,
				data: data,
				error: error,
				type: this.query.query,
				name: this.query.name,
			},
		});
	}

	async executeItems() {
		const { InvalidPayloadException } = this.ctx.exceptions;
		const { ItemsService } = this.ctx.services;

		try {
			if (!this.query?.options?.collection || !this.query?.options?.fields) {
				throw new InvalidPayloadException('invalid params');
			}

			const itemsService = new ItemsService(this.query.options.collection, {
				schema: this.schema,
				accountability: this.accountability,
			});

			const data = await itemsService.readByQuery({
				filter: this.query.options?.filter,
				fields: this.query.options.fields,
				limit: this.query.options?.per_page || 20,
			});

			return data;
		} catch (e: any) {
			throw new InvalidPayloadException(e?.message);
		}
	}

	async executeApi(): Promise<Record<string, any>> {
		const { InvalidPayloadException } = this.ctx.exceptions;

		try {
			if (!this.query.options?.method || !this.query.options?.url) {
				throw new InvalidPayloadException('Invalid params');
			}

			const headers: Record<string, any> = {};
			this.query.options?.headers?.map((e: any) => (headers[e.key] = e.value));

			const params: Record<string, any> = {};
			this.query.options?.query?.map((e: any) => (params[e.key] = e.value));

			const body = this.query.options?.request_body;

			const options = {
				method: this.query.options.method,
				url: this.query.options.url,
				params: params,
				data: body,
				headers: headers,
				timeout: this.query.timeout,
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
