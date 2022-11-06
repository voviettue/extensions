<template>
	<draggable
		v-model="tabs"
		class="widget-grid group full nested"
		item-key="key"
		:force-fallback="true"
		handle=".drag-handle"
		group="tabs"
		:animation="150"
		:fallback-on-body="true"
		:invert-swap="true"
	>
		<template #header>
			<div class="header full">
				<v-icon class="drag-handle" name="drag_indicator" @click.stop />
				<v-icon v-if="!!config?.icon" class="drag-handle" :name="config.icon" @click.stop />
				<v-text-overflow class="name" :text="widget.name" />
				<v-icon v-if="widget.hidden" v-tooltip="`Hidden widget`" name="visibility_off" class="hidden-icon" small />
				<widget-options :widget="widget" />
			</div>
		</template>

		<template #item="{ element }">
			<div class="widget-select grid-col-full">
				<widget-item-tab :key="element.key" :widget="widget" :tab="element" @update="onUpdateTab">
					<template #header>
						<div class="header full">
							<v-icon class="drag-handle" name="drag_indicator" @click.stop />
							<v-text-overflow class="name" :text="element.label" />
							<v-icon v-if="element?.hidden" v-tooltip="`Hidden tab`" name="visibility_off" class="hidden-icon" small />
							<tab-options :tab="element" :widget="widget" @update="onUpdateTab" @delete="onDeleteTab" />
						</div>
					</template>
				</widget-item-tab>
			</div>
		</template>
	</draggable>
</template>

<script setup lang="ts">
import { ref, Ref, watch, computed } from 'vue';
import WidgetItemTab from './widget-item-tab.vue';
import Draggable from 'vuedraggable';
import WidgetOptions from './widget-options.vue';
import TabOptions from './tab-options.vue';
import formFields from '../../widgets';
import { useApi } from '@directus/extensions-sdk';
import { useRoute } from 'vue-router';
import { useNotification } from '../../composables/use-notification';
import { useFrontOfficeStore } from '../../stores/front-office';
import { Tab, Widget } from '../../types';

interface Props {
	widget: Widget;
}
const props = defineProps<Props>();
const api = useApi();
const route = useRoute();
const store = useFrontOfficeStore();
const { notify } = useNotification();
const tabs: Ref<Record<string, any>[]> = ref(props.widget?.options?.tabs || []);
const config = computed(() => formFields.find((e) => e.id === props.widget.widget));

watch(
	() => route.name,
	async () => {
		const res = await api.get(`/items/cms_widgets/${props.widget.id}`);
		tabs.value = res?.data?.data?.options?.tabs;
	}
);

async function onUpdateTab(tab: Tab) {
	tabs.value = tabs.value.map((item: any) => {
		if (item.key === tab.key) {
			return tab;
		}
		return item;
	});
	await store.updateWidget(props.widget.id, { options: { ...props.widget.options, tabs: tabs.value } });
}

async function onDeleteTab(tab: Tab) {
	const widgets = tab.widgets;
	tabs.value = tabs.value.filter((item: any) => {
		return item.key !== tab.key;
	});
	await store.updateWidget(props.widget.id, { options: { ...props.widget.options, tabs: tabs.value } });
	for (const id of widgets) {
		store.deleteWidget(id);
	}

	notify({ title: 'Items deleted' });
}
</script>
