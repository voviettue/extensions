import axios from 'axios';
import { ApiExtensionContext } from '@directus/shared/types';
import { BaseException } from '@directus/shared/exceptions';

async function deleteLogs(req: any, res: any, ctx: ApiExtensionContext) {
	try {
		const { ItemsService } = ctx.services;

		const activityService = new ItemsService('directus_activity', {
			schema: req.schema,
			accountability: req.accountability,
		});

		await activityService.deleteByQuery({
			filter: {
				item: { _eq: req.params.id },
				action: { _eq: 'execute' },
			},
		});
	} catch (e: any) {
		throw new BaseException(e.message, e.status, e?.code);
	}
}

async function queryExecute(req: any, res: any, ctx: ApiExtensionContext) {
	const { ItemsService } = ctx.services;

	const queryItemsService = new ItemsService('cms_queries', {
		schema: req.schema,
		accountability: req.accountability,
	});

	const activityService = new ItemsService('directus_activity', {
		schema: req.schema,
		accountability: req.accountability,
	});

	let query = null;
	let error = null;

	try {
		query = await queryItemsService.readOne(req.params.id, { fields: '*' });
		let data = null;

		switch (query.query) {
			case 'items':
				data = await executeQueryItems(req, query, ctx);
				break;
			case 'api':
				data = await executeQueryApi(query, ctx);
				break;
			default:
				break;
		}

		if (data) {
			await Promise.all([
				queryItemsService.updateOne(query.id, { output: data }),
				activityService.createOne({
					action: 'execute',
					user: req.accountability!.user,
					collection: query?.options?.collection || '',
					ip: req.accountability!.ip,
					user_agent: req.accountability!.userAgent,
					item: req.params.id,
					comment: {
						message: `[${query.name}] Execution started from user request`,
						data: data,
						type: query?.query,
						name: query?.name,
					},
				}),
			]);
		}

		return { data: data };
	} catch (e: any) {
		error = e;
		error.errMessage = e.message;
	}

	await activityService.createOne({
		action: 'execute',
		user: req.accountability!.user,
		collection: query?.options?.collection || '',
		ip: req.accountability!.ip,
		user_agent: req.accountability!.userAgent,
		item: req.params.id,
		comment: {
			message: `[${query?.name}] Execution failed with status ${error.status} ${error.code}`,
			erorr: error,
			type: query?.query,
			name: query?.name,
		},
	});

	throw new BaseException(error.message, error.status, error?.code);
}

async function executeQueryApi(query: any, ctx: ApiExtensionContext) {
	const { InvalidPayloadException } = ctx.exceptions;

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
		const message = (e.response.data.errors && e.response.data.errors[0]?.message) || '';
		const statusCode = e.response.status;
		throw new BaseException(message, statusCode, e?.code);
	}
}

async function executeQueryItems(req: any, query: any, ctx: ApiExtensionContext) {
	const { InvalidPayloadException } = ctx.exceptions;
	const { ItemsService } = ctx.services;

	try {
		if (!query?.options?.collection || !query?.options?.fields) {
			throw new InvalidPayloadException('invalid params');
		}

		const itemsService = new ItemsService(query.options.collection, {
			schema: req.schema,
			accountability: req.accountability,
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

export default {
	queryExecute,
	deleteLogs,
};
