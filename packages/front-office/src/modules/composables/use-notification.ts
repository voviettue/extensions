import { useStores } from '@directus/extensions-sdk';

export const useNotification = () => {
	const { useNotificationsStore } = useStores();
	return { notify, unexpectedError };

	function notify(notification: Record<string, any>) {
		const store = useNotificationsStore();
		store.add(notification);
	}

	function unexpectedError(error: any) {
		const store = useNotificationsStore();
		const message = error.response?.data?.errors?.[0]?.message || error.message || undefined;

		// eslint-disable-next-line no-console
		console.warn(error);

		store.add({
			title: 'Unexpected Error',
			text: message,
			type: 'error',
			dialog: true,
			error,
		});
	}
};
