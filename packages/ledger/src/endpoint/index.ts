import { defineEndpoint } from '@directus/extensions-sdk';
import docControllter from './controllers/docs';
import collectionControllter from './controllers/collections';
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
				return res.status(error?.status || 500).json({ status: error?.status, message: error?.message });
			}
		});

		// COLLECTION ROUTE
		router.post('/collections', async (req: any, res: any) => {
			try {
				const data = await collectionControllter.create(req, res, ctx);
				return res.json(data);
			} catch (error: any) {
				return res
					.status(error?.status || 500)
					.json({ status: error?.status, message: error?.message, extensions: error.extensions });
			}
		});

		router.delete('/collections', async (req: any, res: any) => {
			try {
				const data = await collectionControllter.deleteMany(req, res, ctx);
				return res.json(data);
			} catch (error: any) {
				return res.status(error?.status || 500).json({ status: error?.status, message: error?.message });
			}
		});

		router.delete('/collections/:id', async (req: any, res: any) => {
			try {
				const data = await collectionControllter.deleteOne(req, res, ctx);
				return res.json(data);
			} catch (error: any) {
				return res.status(error?.status || 500).json({ status: error?.status, message: error?.message });
			}
		});

		router.post('/collections/undelete-by-hash/:hash', async (req: any, res: any) => {
			try {
				const data = await collectionControllter.unDeleteByHash(req, res, ctx);
				return res.json(data);
			} catch (error: any) {
				return res.status(error?.status || 500).json({ status: error?.status, message: error?.message });
			}
		});

		// HEALTH CHECK
		router.get('/healthcheck', async (req: any, res: any) => {
			try {
				const data = await healthCheckControllter.healthCheck(req, res, ctx);
				return res.json(data);
			} catch (error: any) {
				return res.status(error?.status || 500).json({ status: error?.status, message: error?.message });
			}
		});
	},
});
