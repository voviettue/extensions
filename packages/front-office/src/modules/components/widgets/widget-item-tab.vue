<template>
	<draggable
		v-model="items"
		class="widget-grid group full nested"
		:class="[`grid-col-${widget.width}`]"
		item-key="key"
		handle=".drag-handle"
		group="widgets"
		:animation="200"
		@update:model-value="onSort"
	>
		<template #header>
			<slot name="header">
				<div class="header full">
					<v-icon class="drag-handle" name="drag_indicator" @click.stop />
					<v-icon v-if="!!config?.icon" class="drag-handle" :name="config.icon" @click.stop />
					<v-text-overflow class="name" :text="widget.name" />
					<v-icon v-if="widget.hidden" v-tooltip="`Hidden widget`" name="visibility_off" class="hidden-icon" small />
					<widget-options :widget="widget" />
				</div>
			</slot>
		</template>

		<template #item="{ element }">
			<widget-item v-tooltip="`${element.name}`" :widget="element" />
		</template>
	</draggable>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import WidgetOptions from './widget-options.vue';
import WidgetItem from './widget-item.vue';
import Draggable from 'vuedraggable';
import formFields from '../../widgets';
import { useFrontOfficeStore } from '../../stores/front-office';
import { storeToRefs } from 'pinia';
import { Widget, Tab } from '../../types';

interface Props {
	widget: Widget;
	tab: Tab;
}
const props = defineProps<Props>();
const emit = defineEmits(['update']);
const store = useFrontOfficeStore();
const { widgets } = storeToRefs(store);
const items = ref([]);
const config = computed(() => formFields.find((e) => e.id === props.widget.widget));

watch(
	[widgets],
	() => {
		items.value = widgets.value.filter((item: any) => props.tab.widgets?.includes(item.id));
	},
	{ immediate: true }
);

async function onSort(values) {
	store.sortWidgets(values, props.widget.id);
	const widgets = values.map((e: any) => e.id);
	emit('update', { ...props.tab, widgets });
}
</script>
