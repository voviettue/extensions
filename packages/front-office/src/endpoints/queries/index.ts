import { defineEndpoint } from '@directus/extensions-sdk';

export default defineEndpoint({
	id: 'front-office/queries',
	handler: async (router) => {
		router.post('/:id/execute', (req: any, res: any) => {
			res.json({
				endpoint: '/front-office/queries/:id/execute',
				id: req.params.id,
			});
		});
	},
});
