import { defineHook } from '@directus/extensions-sdk';
import Mixpanel from 'mixpanel';

export default defineHook(({ action }, { database, logger }) => {
	const MIXPANEL_PROJECT_TOKEN = process.env.MIXPANEL_PROJECT_TOKEN || '';
	const TERMINAL_WORKSPACE_SLUG = process.env.TERMINAL_WORKSPACE_SLUG || '';

	if (!MIXPANEL_PROJECT_TOKEN) {
		logger.warn('Can not track data by missing key MIXPANEL_PROJECT_TOKEN');
		return;
	}

	const mixpanel = Mixpanel.init(MIXPANEL_PROJECT_TOKEN);
	const users: any = {};

	const getUser = async (id: string) => {
		if (users[id]) return users[id];

		const user: any = await database.from('directus_users').where('id', '=', id).first();
		users[user?.id] = user;

		return user;
	};

	const trackSignIn = async (event: any, context: any) => {
		if (event.status !== 'success') return;

		const user: any = await getUser(event.user);

		mixpanel.people.set(user?.email, {
			$email: user?.email,
			$first_name: user?.first_name,
			$last_name: user?.last_name,
		});

		mixpanel.track('Log In', {
			distinct_id: user?.email,
			ip: context.accountability.ip,
			userAgent: context.accountability.userAgent,
			provider: event.provider,
			workspace: TERMINAL_WORKSPACE_SLUG,
		});
	};

	const trackLogOut = async (event: any, context: any) => {
		console.log(event);
		if (event.user) {
			const user: any = await getUser(event.user);
			mixpanel.track('Log Out', {
				distinct_id: user?.email,
				ip: context.accountability.ip,
				userAgent: context.accountability.userAgent,
				workspace: TERMINAL_WORKSPACE_SLUG,
			});
		}
	};

	const trackAccessPage = async (event: any, context: any) => {
		if (event?.request?.path === '/users/me') {
			const user: any = await getUser(context.accountability.user);

			mixpanel.track('Access Page', {
				distinct_id: user?.email,
				ip: context.accountability.ip,
				userAgent: context.accountability.userAgent,
				workspace: TERMINAL_WORKSPACE_SLUG,
			});
		}
	};

	const trackCreateItem = async (event: any, context: any) => {
		const user: any = await getUser(context.accountability.user);
		mixpanel.track('Create Item', {
			distinct_id: user?.email,
			collection: event.collection,
			workspace: TERMINAL_WORKSPACE_SLUG,
		});
	};

	const trackReadItem = async (event: any, context: any) => {
		const user: any = await getUser(context.accountability.user);
		mixpanel.track('Read Item', {
			distinct_id: user?.email,
			collection: event.collection,
			workspace: TERMINAL_WORKSPACE_SLUG,
		});
	};

	const trackUpdateItem = async (event: any, context: any) => {
		const user: any = await getUser(context.accountability.user);
		mixpanel.track('Update Item', {
			distinct_id: user?.email,
			collection: event.collection,
			workspace: TERMINAL_WORKSPACE_SLUG,
		});
	};

	const trackDeleteItem = async (event: any, context: any) => {
		const user: any = await getUser(context.accountability.user);
		mixpanel.track('Delete Item', {
			distinct_id: user?.email,
			countItem: event.payload.length,
			collection: event.collection,
			workspace: TERMINAL_WORKSPACE_SLUG,
		});
	};

	const trackCreateUser = async (event: any, context: any) => {
		const user: any = await getUser(context.accountability.user);
		if (event.payload.status === 'invited') {
			mixpanel.track('Invite User', {
				distinct_id: user?.email,
				email: event.payload.email,
				workspace: TERMINAL_WORKSPACE_SLUG,
			});
		} else {
			mixpanel.track('Create User', {
				distinct_id: user?.email,
				email: event.payload.email,
				workspace: TERMINAL_WORKSPACE_SLUG,
			});
		}
	};

	const trackDeleteUser = async (_event: any, context: any) => {
		const user: any = await getUser(context.accountability.user);
		mixpanel.track('Delete User', {
			distinct_id: user?.email,
			workspace: TERMINAL_WORKSPACE_SLUG,
		});
	};

	const trackCreateCollection = async (event: any, context: any) => {
		const user: any = await getUser(context.accountability.user);
		mixpanel.track('Create Collection', {
			distinct_id: user?.email,
			singleton: event.payload.singleton,
			name: event.payload.collection,
			workspace: TERMINAL_WORKSPACE_SLUG,
		});
	};

	const trackDeleteCollection = async (event: any, context: any) => {
		const user: any = await getUser(context.accountability.user);
		mixpanel.track('Delete Collection', {
			distinct_id: user?.email,
			name: event.payload[0] || '',
			workspace: TERMINAL_WORKSPACE_SLUG,
		});
	};

	action('auth.login', trackSignIn);
	action('auth.logout', trackLogOut);
	action('response', trackAccessPage);

	// action('items.read', trackReadItem);
	action('items.create', trackCreateItem);
	action('items.update', trackUpdateItem);
	action('items.delete', trackDeleteItem);

	action('users.create', trackCreateUser);
	action('users.delete', trackDeleteUser);

	action('collections.create', trackCreateCollection);
	action('collections.delete', trackDeleteCollection);
});
