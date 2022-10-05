<template>
	<div class="widgets">
		<div class="field-label type-label">
			<span class="field-name"><v-text-overflow text="Widgets" /></span>
		</div>
		<v-info v-if="items.length === 0" icon="web" title="No Widgets"></v-info>

		<v-list v-else class="draggable-list">
			<draggable
				:model-value="nestedList"
				:force-fallback="true"
				:group="{ name: 'widgets' }"
				:animation="150"
				class="root-drag-container-widget"
				item-key="widget"
				handle=".drag-handle"
				:fallback-on-body="true"
				:invert-swap="true"
				@update:model-value="onSort($event)"
			>
				<template #item="{ element }">
					<WidgetItem
						:update-visiable="updateVisiable"
						:widget="element"
						:list-widget="items"
						:delete-widget="deleteWidget"
						:class="getClass(element)"
						@reload="getWidgetsItems"
					/>
				</template>
			</draggable>
		</v-list>
		<div class="new-widget">
			<v-button :to="`/front-office/pages/${id}/widget/+`">Create Widget</v-button>
		</div>

		<router-view name="addWidget"></router-view>
	</div>
</template>
<script setup lang="ts">
import { useApi } from '@directus/extensions-sdk';
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';
import WidgetItem from './widget-item.vue';
import { useNotification } from '../../composables/use-notification';

const route = useRoute();
const api = useApi();
// const props = defineProps<{ widgets: Array<number | string> }>();
const items = ref([]);
const { notify } = useNotification();
const id = computed(() => {
	return route.params.id;
});
const nestedList = computed(() => {
	return items.value.filter((_: any) => !_.parent);
});

watch(
	() => route.name,
	() => {
		getWidgetsItems();
	},
	{ deep: true }
);

async function getWidgetsItems() {
	try {
		const params = { filter: { page: id.value } };
		const res = await api.get(`/items/cms_widgets`, { params });
		items.value = res.data.data?.sort((a, b) => (a.sort ?? 1000) - (b.sort ?? 1000));
	} catch {
		//
	}
}

async function updateVisiable(widget: any) {
	try {
		await api.patch(`/items/cms_widgets/${widget.id}`, { hidden: !widget.hidden });
		getWidgetsItems();
	} catch {
		//
	}
}
async function deleteWidget(widget: any) {
	try {
		await api.delete(`/items/cms_widgets/${widget.id}`);
		notify({ title: 'Item deleted' });
		getWidgetsItems();
	} catch {
		//
	}
}
async function onSort(val) {
	items.value = val.map((item, index) => {
		return {
			...item,
			sort: index,
			parent: null,
		};
	});
	const apis = items.value.map((k: any) => {
		return api.patch(`/items/cms_widgets/${k.id}`, k);
	});
	await Promise.allSettled(apis);
	getWidgetsItems();
}
function getClass(el: Record<string, any>) {
	switch (el.width) {
		case 'full':
			return 'grid-full';
		case 'half':
			return 'grid-half';
		case '1':
			return 'grid-one';
		case '2':
			return 'grid-two';
		case '3':
			return 'grid-three';
		case '4':
			return 'grid-four';
		case '5':
			return 'grid-five';
	}
}
onMounted(() => {
	getWidgetsItems();
});
</script>

<style scope lang="scss">
.widgets {
	max-width: 100%;
}
.field-label {
	margin-bottom: 10px;
}
.new-widget {
	margin-top: 20px;
}
.root-drag-container-widget {
	width: 100%;
	display: grid;
	grid-template-columns: repeat(6, minmax(0, 1fr));
	gap: 10px;
	.grid-full {
		grid-column: span 6 / span 6;
	}
	.grid-half {
		grid-column: span 3 / span 6;
	}
	.grid-one {
		grid-column: span 1 / span 6;
	}
	.grid-two {
		grid-column: span 2 / span 6;
	}
	.grid-three {
		grid-column: span 3 / span 6;
	}
	.grid-four {
		grid-column: span 4 / span 6;
	}
	.grid-five {
		grid-column: span 5 / span 6;
	}
}
</style>
