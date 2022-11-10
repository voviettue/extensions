import { defineStore } from 'pinia';
import { useApi } from '@directus/extensions-sdk';
import { Widget } from '../types';
import cloneDeep from 'lodash/cloneDeep';

const tryDuplicate = async (widget: Widget, parent: null | number, index = 0): Promise<Widget> => {
	index++;
	const store = useWidgetStore();
	try {
		const payload = cloneDeep(widget);
		delete payload['id'];
		payload.name += ' (Copy)';
		payload.sort = payload.sort ?? null;
		payload.parent = parent;
		const key = `${payload.key}_${index}`;

		const clonedWidget: Widget = await store.create({ ...payload, key });
		await duplicateChildren(widget, clonedWidget.id, index);

		return clonedWidget;
	} catch (err: any) {
		const code = err?.response?.data?.errors?.[0]?.extensions?.code;
		if (code === 'RECORD_NOT_UNIQUE' && index <= 10) {
			return await tryDuplicate(widget, parent, index);
		}

		throw err;
	}
};

const duplicateChildren = async (widget: Widget, parent: null | number, index: number) => {
	const store = useWidgetStore();
	const childWidgets = store.widgets.filter((item: any) => {
		return item.parent === widget.id;
	});

	try {
		for (const childWidget of childWidgets) {
			await tryDuplicate(childWidget, parent, index);
		}
	} catch {
		// ignore error for children
	}
};

export const useWidgetStore = defineStore({
	id: 'widgetStore',
	state: () => ({
		hydrated: false,
		widgets: [],
		copyId: null as number | null,
		_api: useApi(),
	}),
	getters: {
		// nothing
	},
	actions: {
		async hydrate(page: any) {
			const params = { filter: { page: page } };
			const res = await this._api.get(`/items/cms_widgets`, { params });
			this.widgets = res.data.data?.sort((a: any, b: any) => (a.sort ?? 1000) - (b.sort ?? 1000));
		},
		async get(id: string | number) {
			const res = await this._api.get(`/items/cms_widgets/${id}`);
			return res?.data?.data;
		},
		async create(payload: Record<string, any>) {
			const res = await this._api.post(`/items/cms_widgets`, payload);
			return res?.data?.data;
		},
		async update(id: string | number, payload: Record<string, any>) {
			await this._api.patch(`/items/cms_widgets/${id}`, payload);
		},
		async delete(id: number) {
			await this._api.delete(`/items/cms_widgets/${id}`);
		},
		async duplicate(widget: Widget) {
			await tryDuplicate(widget, widget.parent);
		},
		async paste(page: number | string) {
			if (!this.copyId) return;

			const widget = await this.get(this.copyId);
			widget.sort = null;
			widget.page = page;
			widget.parent = null;
			await this.duplicate(widget);
			await this.hydrate(page);
			this.copyId = null;
		},
		async sort(widgets: Widget[], parent: any) {
			const updateWidgets = widgets.filter((e: any, index) => {
				if (e.parent === parent && e.sort === index) {
					return false;
				}
				e.parent = parent;
				e.sort = index;
				return true;
			});

			const promises = updateWidgets.map((widget: Widget) => {
				return this.update(widget.id, {
					parent: widget.parent,
					sort: widget.sort,
				});
			});

			return Promise.allSettled(promises);
		},
	},
});
