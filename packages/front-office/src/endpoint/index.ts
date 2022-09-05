import { defineEndpoint } from '@directus/extensions-sdk';
import queryController from '../controllers/queries';

export default defineEndpoint({
	id: 'front-office',
	handler: async (router, ctx) => {
		// QUERY ROUTE
		router.patch('/queries/:id/execute', async (req: any, res: any) => {
			try {
				const data = await queryController.execute(req, res, ctx);

				return res.json({ data: data });
			} catch (error: any) {
				return res.status(error.status).json({ status: error.status, message: error.message });
			}
		});

		router.delete('/queries/:id/logs', async (req: any, res: any) => {
			try {
				await queryController.deleteLogs(req, res, ctx);

				res.json();
			} catch (error: any) {
				return res.status(error.status).json({ status: error.status, message: error.message });
			}
		});
	},
});
