import { defineStore } from 'pinia';
import { useApi } from '@directus/extensions-sdk';
import { parseQuery } from '../utils/parse-query';
import { Widget } from '../types';

export const useFrontOfficeStore = defineStore({
	id: 'frontOfficeStore',
	state: () => ({
		hydrated: false,
		pages: [],
		widgets: [],
		menus: [],
		queries: [] as any[],
		logList: [],
		api: useApi(),
	}),
	getters: {
		context() {
			const $query: any = {};
			for (const query of this.queries) {
				$query[query.key] = parseQuery(query);
			}

			return { $query };
		},
	},
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
			this.menus = (res?.data?.data || []).sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
		},
		async hydrateQueries() {
			const res = await this.api.get<any>(`/items/cms_queries`, { params: { limit: -1 } });
			this.queries = (res?.data?.data || []).sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
		},
		async hydrateWidgets(page: any) {
			const params = { filter: { page: page } };
			const res = await this.api.get(`/items/cms_widgets`, { params });
			this.widgets = res.data.data?.sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
		},
		async updateMenus(items: Array<Record<string, any>>) {
			const apis = items.map(async (item: any) => {
				return await this.api.patch<any>(`/items/cms_menus/${item.id}`, item);
			});
			await Promise.allSettled(apis);
		},
		async updateWidget(id: string | number, payload: Record<string, any>) {
			await this.api.patch(`/items/cms_widgets/${id}`, payload);
		},
		async sortWidgets(widgets: Widget[], parent: any) {
			const updateWidgets = widgets.filter((e: any, index) => {
				if (e.parent === parent && e.sort === index) {
					return false;
				}
				e.parent = parent;
				e.sort = index;
				return true;
			});

			const promises = updateWidgets.map((widget: Widget) => {
				return this.updateWidget(widget.id, {
					parent: widget.parent,
					sort: widget.sort,
				});
			});

			return Promise.allSettled(promises);
		},
		async deleteWidget(id: number) {
			await this.api.delete(`/items/cms_widgets/${id}`);
		},
		async getLogListByQuery(query?: any) {
			const logListResponse = await this.api.get<any>(`/activity`, query);
			this.logList = (logListResponse?.data?.data || []).map((e: any) => {
				return { ...e, comment: e.comment && JSON.parse(e.comment) };
			});
		},
	},
});
