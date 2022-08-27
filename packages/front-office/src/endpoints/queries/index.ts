import axios from 'axios';
import { defineEndpoint } from '@directus/extensions-sdk';
import { Accountability, SchemaOverview } from '@directus/shared/types';
import { Action } from '@directus/shared/types';

export default defineEndpoint({
	id: 'front-office/queries',
	handler: async (router, { services, exceptions }) => {
		const { ItemsService } = services;
		const { InvalidPayloadException } = exceptions;

		router.patch('/:id/execute', async (req: any, res: any) => {
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
				let result = null;

				switch (query.query) {
					case 'items':
						result = await itemsQueryExecute(query, req.schema, req.accountability);
						break;
					case 'api':
						result = await apiQueryExecute(query);
						break;
					default:
						break;
				}

				if (result) {
					await Promise.all([
						queryItemsService.updateOne(query.id, { output: result }),
						activityService.createOne({
							action: 'execute',
							user: req.accountability!.user,
							collection: query?.options?.collection || '',
							ip: req.accountability!.ip,
							user_agent: req.accountability!.userAgent,
							item: req.params.id,
							comment: {
								message: `[${query.name}] Execution started from user request`,
								data: result,
								type: query?.query,
								name: query?.name,
							},
						}),
					]);
				}

				return res.json({ data: result });
			} catch (e: any) {
				error = e;
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

			return res.status(error.status).json({ status: error.status, message: error.message });
		});

		router.get('/test', async (req: any, res: any) => {
			res.json({ data: 'OK1' });
		});

		router.post('/test', async (req: any, res: any) => {
			res.json({ data: 'OK2' });
		});

		router.put('/test', async (req: any, res: any) => {
			res.json({ data: 'OK3' });
		});

		router.patch('/test', async (req: any, res: any) => {
			res.json({ data: 'OK4' });
		});

		router.delete('/test', async (req: any, res: any) => {
			res.json({ data: 'OK5' });
		});

		async function apiQueryExecute(query: any) {
			try {
				if (!query.options?.method || !query.options?.url) {
					throw new InvalidPayloadException('Invalid params');
				}

				// -TODO
				const headers = query.options?.headers.reduce((acc: any, { key, value }) => ({ ...acc, [key]: value }), {});
				const params = query.options?.query.reduce((acc: any, { key, value }) => ({ ...acc, [key]: value }), {});
				const body = query.options?.request_body;

				let options = {};
				if (query.options.method !== 'delete') {
					options = {
						method: query.options.method,
						url: query.options.url,
						params: params,
						data: body,
						headers: headers,
						timeout: query.timeout,
					};
				}

				const { data } = await axios(options);
				return data;
			} catch (error: any) {
				throw new InvalidPayloadException(error?.message);
			}
		}

		async function itemsQueryExecute(query: any, schema: SchemaOverview, accountability: Accountability) {
			try {
				if (!query?.options?.collection || !query?.options?.fields) {
					throw new InvalidPayloadException('invalid params');
				}

				const itemsService = new ItemsService(query.options.collection, {
					schema: schema,
					accountability: accountability,
				});

				const data = await itemsService.readByQuery({
					filter: query.options?.filter,
					fields: query.options.fields,
					limit: query.options?.per_page || 20,
				});

				return data;
			} catch (error: any) {
				throw new InvalidPayloadException(error?.message);
			}
		}
	},
});
