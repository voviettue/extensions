import { defineEndpoint } from '@directus/extensions-sdk';
import docControllter from './controllers/docs';

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
	},
});
