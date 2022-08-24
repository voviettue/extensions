import { defineStore } from 'pinia';
import { useApi } from '@directus/extensions-sdk';

export const useFrontOfficeStore = defineStore({
	id: 'frontOfficeStore',
	state: () => ({
		pageList: [],
		menuList: [],
		api: useApi(),
	}),
	actions: {
		async hydrate() {
			await this.getPageList();
			await this.getMenuList();
		},
		async getPageList() {
			const pageListResponse = await this.api.get<any>(`/items/cms_pages`, { params: { limit: -1 } });
			this.pageList = (pageListResponse?.data?.data || []).map((item: any) => {
				return { text: item.title, value: item.id };
			});
		},
		async getMenuList() {
			const menuListResponse = await this.api.get<any>(`/items/cms_menus`, { params: { limit: -1 } });
			this.menuList = (menuListResponse?.data?.data || []).sort(
				(a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000)
			);
		},
		async updateMenuItems(items: Array<Record<string, any>>) {
			const apis = items.map(async (item: any) => {
				return await this.api.patch<any>(`/items/cms_menus/${item.id}`, item);
			});
			await Promise.allSettled(apis);
		},
	},
});
