import { defineEndpoint } from '@directus/extensions-sdk';
import queryController from '../controllers/queries';

export default defineEndpoint({
	id: 'front-office/queries',
	handler: async (router, ctx) => {
		router.patch('/:id/execute', async (req: any, res: any) => {
			try {
				const data = await queryController.queryExecute(req, res, ctx);

				return res.json({ data: data });
			} catch (error: any) {
				return res.status(error.status).json({ status: error.status, message: error.message });
			}
		});

		router.delete('/:id/logs', async (req: any, res: any) => {
			try {
				await queryController.deleteLogs(req, res, ctx);

				res.json();
			} catch (error: any) {
				return res.status(error.status).json({ status: error.status, message: error.message });
			}
		});
	},
});
