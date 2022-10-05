import { defineStore } from 'pinia';
import { useApi } from '@directus/extensions-sdk';

export const useFrontOfficeStore = defineStore({
	id: 'frontOfficeStore',
	state: () => ({
		hydrated: false,
		pages: [],
		menus: [],
		queries: [],
		logList: [],
		queries: [],
		api: useApi(),
	}),
	actions: {
		async hydrate() {
			await Promise.all([this.hydratePages(), this.hydrateMenus(), this.hydrateQueries()]);
			this.hydrated = true;
		},
		async hydratePages() {
			const res = await this.api.get<any>(`/items/cms_pages`, { params: { limit: -1 } });
			this.pages = (res?.data?.data || []).sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
		},
		async hydrateMenus() {
			const res = await this.api.get<any>(`/items/cms_menus`, { params: { limit: -1, sort: ['-id'] } });
			this.menus = res?.data?.data || [];
		},
		async hydrateQueries() {
			const res = await this.api.get<any>(`/items/cms_queries`, { params: { limit: -1 } });
			this.queries = (res?.data?.data || []).sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
		},
		async updateMenuItems(items: Array<Record<string, any>>) {
			const apis = items.map(async (item: any) => {
				return await this.api.patch<any>(`/items/cms_menus/${item.id}`, item);
			});
			await Promise.allSettled(apis);
		},
		async getLogListByQuery(query?: any) {
			const logListResponse = await this.api.get<any>(`/activity`, query);
			this.logList = (logListResponse?.data?.data || []).map((e: any) => {
				return { ...e, comment: e.comment && JSON.parse(e.comment) };
			});
		},
		async hydrateQueries() {
			const res = await this.api.get<any>(`/items/cms_queries`, { params: { limit: -1 } });
			this.queries = (res?.data?.data || []).sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
		},
	},
});
