import { defineEndpoint } from '@directus/extensions-sdk';
import Stripe from 'stripe';

export default defineEndpoint({
	id: 'billing',
	handler: (router) => {
		const apiKey = process.env.STRIPE_API_SECRET_KEY || '';
		const stripeCustomerId = process.env.STRIPE_CUSTOMER_ID || '';
		const siteAddress = process.env.SITE_ADDRESS;
		const stripe = new Stripe(apiKey, {
			apiVersion: '2020-08-27',
			maxNetworkRetries: 5,
			timeout: 10 * 1000,
		});

		async function getSubscription() {
			return stripe.subscriptions
				.list({
					customer: stripeCustomerId,
					limit: 1,
					expand: ['data.plan.product'],
				})
				.then((response) => {
					if (response.data.length === 0) {
						return null;
					}
					return response.data[0];
				});
		}

		async function getUpcomingInvoice() {
			// await updateUsage(subscription)
			return stripe.invoices
				.retrieveUpcoming({
					customer: stripeCustomerId,
				})
				.then((response): any => {
					return response;
				});
		}

		// async function getTotalUser() {
		// 	const users = await database.from('directus_users').where('email', 'not like', '%pangara.com')
		// 	return users.length
		// }

		// async function updateUsage(subscription: any) {
		// 	const itemId = subscription?.items?.data[0]?.id
		// 	await stripe.subscriptionItems.createUsageRecord(itemId, {
		// 		quantity: await getTotalUser(),
		// 		action: 'set',
		// 		timestamp: subscription.current_period_start
		// 	})
		// }

		router.get('/check', (_req, res) => {
			if (!apiKey || !stripeCustomerId) {
				res.statusCode = 403;
				return res.send("You don't have permission!");
			}

			return res.send('');
		});

		router.get('/subscription', async (_req, res) => {
			try {
				const subscription: any = await getSubscription();

				if (!subscription) {
					return res.send({ data: null });
				}

				const upcomingInvoice: any = await getUpcomingInvoice();

				return res.send({ data: subscription, meta: { upcomingInvoice } });
			} catch (err: any) {
				res.statusCode = err.statusCode || 400;
				return res.send(err);
			}
		});

		router.post('/portal/sessions', (_req, res) => {
			const returnUrl = siteAddress ? `http://${siteAddress}/admin/workspace` : _req.headers.referer;
			stripe.billingPortal.sessions
				.create({
					customer: stripeCustomerId,
					return_url: returnUrl,
				})
				.then((response) => res.send(response))
				.catch((err: any) => {
					res.statusCode = err.statusCode || 400;
					return res.send(err);
				});
		});
	},
});
