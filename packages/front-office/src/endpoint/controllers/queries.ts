import { ApiExtensionContext } from '@directus/shared/types';
import { BaseException } from '@directus/shared/exceptions';
import { QueryService } from '../services/QueryServices';

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

async function execute(req: any, res: any, ctx: ApiExtensionContext) {
	let data: any = null;
	let error: any = null;
	const queryId: number = req.params.id;
	const queryService: QueryService = new QueryService(req.schema, req.accountability, ctx);

	try {
		data = await queryService.execute(queryId, req.body);
	} catch (e: any) {
		error = e;
		error.errMessage = e.message;
	}

	await queryService.createLog(queryId, data, error);

	if (error) {
		throw new BaseException(error.message, error.status, error?.code);
	}

	return data;
}

export default {
	execute,
	deleteLogs,
};
