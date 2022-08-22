import { useStores } from '@directus/extensions-sdk';

export const useNotification = () => {
	const { useNotificationsStore } = useStores();
	return { notify };
	function notify(notification: Record<string, any>) {
		const store = useNotificationsStore();
		store.add(notification);
	}
};
