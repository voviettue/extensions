import { useApi } from '@directus/extensions-sdk';
import { useValidate } from './use-validate';
import { useRouter } from 'vue-router';
import { useNotification } from './use-notification';

export const useItem = () => {
	const api = useApi();
	const { notify } = useNotification();
	const { validateItem } = useValidate();
	const router = useRouter();
	return { getItem, saveItem, createItem };
	async function getItem(collection: string, id: string): Promise<Record<string, any>> {
		try {
			const response = await api.get(`/items/${collection}/${id}`);
			return { ...response.data.data };
		} catch (err) {
			// eslint-disable-next-line no-console
			console.warn(err);
		}
		return {};
	}
	async function saveItem(
		collection: string,
		id: string,
		edits: Record<string, any>,
		item?: Record<string, any>,
		options?: Record<string, any>[],
		redirect?: string
	): Promise<Record<string, any>[]> {
		const data = { ...(item || {}), ...edits };
		let errors: string | any[] = [];
		errors = validateItem(data, options || []);
		if (errors.length) return errors;
		try {
			await api.patch(`/items/${collection}/${id}`, data);
			notify({ title: 'Update Success' });
			router.push(redirect || '/');
		} catch {
			notify({ title: 'Update Fail' });
			//
		}
		return [];
	}
	async function createItem(
		collection: string,
		data: Record<string, any>,
		options?: Record<string, any>[],
		redirect?: string
	): Promise<Record<string, any>[]> {
		let errors = [];
		errors = validateItem(data, options || []);
		if (errors.length) return errors;
		const arrUnique =
			options
				?.reduce((pre: string[], item: Record<string, any>) => {
					if (item.meta?.unique) pre.push(item.field);
					return pre;
				}, [])
				.map((el) => checkUnique(collection, data, el)) || [];
		const arr = await Promise.allSettled(arrUnique);
		// if (!(await checkUnique(collection, data, 'endpoint'))) {
		// 	errors.push({ field: 'endpoint', type: 'unique', hidden: false, group: null });
		// 	return errors;
		// }
		arr.map((err) => {
			// console.log(err);
			if (err.status === 'fulfilled' && err.value?.value) {
				errors.push({ field: err.value?.name, type: 'unique', hidden: false, group: null });
			}
		});
		if (errors.length) return errors;
		try {
			await api.post(`/items/${collection}`, data);
			notify({ title: 'Create Success' });
			router.push(redirect || '/');
		} catch (err) {
			// eslint-disable-next-line no-console
			console.warn(err);
		}
		return [];
	}
	async function checkUnique(collection: string, data: Record<string, any>, str: string): Promise<Record<string, any>> {
		try {
			const payload: Record<string, any> = {};
			payload[str] = data[str];
			const res = await api.get(`/items/${collection}/?filter=${JSON.stringify(payload)}`);
			return {
				name: str,
				value: res.data.data?.length,
			};
		} catch {
			//
		}
		return {};
	}
};
