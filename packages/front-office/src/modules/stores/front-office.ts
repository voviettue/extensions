import { defineStore } from 'pinia';
import { useApi } from '@directus/extensions-sdk';

export const useFrontOfficeStore = defineStore({
	id: 'frontOfficeStore',
	state: () => ({
		pageList: [],
	}),
	actions: {
		async hydrate() {
			const api = useApi();

			const pageListResponse = await api.get<any>(`/items/cms_pages`, { params: { limit: -1 } });
			this.pageList = (pageListResponse?.data?.data || []).map((item: any) => {
				return { text: item.title, value: item.id };
			});
		},
	},
});
