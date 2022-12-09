import { defineEndpoint } from '@directus/extensions-sdk';
import docControllter from './controllers/docs';
import healthCheckControllter from './controllers/healthCheck';

export default defineEndpoint({
	id: 'ledger',
	handler: async (router, ctx) => {
		// DOCS ROUTE
		router.get('/docs/:id', async (req: any, res: any) => {
			try {
				const data = await docControllter.docs(req, res, ctx);
				return res.json(data);
			} catch (error: any) {
				return res.status(error?.status).json({ status: error?.status, message: error?.message });
			}
		});

		// HEALTH CHECK
		router.get('/healthcheck', async (req: any, res: any) => {
			try {
				const data = await healthCheckControllter.healthCheck(req, res, ctx);
				return res.json(data);
			} catch (error: any) {
				return res.status(error?.status).json({ status: error?.status, message: error?.message });
			}
		});
	},
});
