<template>
	<div class="widgets">
		<h2 class="name type-label">
			Widgets
			<span class="instant-save">Saves automatically</span>
		</h2>
		<v-info v-if="widgets.length === 0" icon="web" title="No Widgets"></v-info>

		<v-list v-else class="draggable-list">
			<draggable
				v-model="items"
				group="widgets"
				class="widget-grid"
				item-key="key"
				handle=".drag-handle"
				:animation="200"
				@update:model-value="onSort($event)"
			>
				<template #item="{ element }">
					<WidgetItem :widget="element" />
				</template>
			</draggable>
		</v-list>

		<div class="widget-actions">
			<v-chip v-if="copyId">
				<span>You have a copied widget.&nbsp;</span>
				<a class="btn-paste" href="#" @click="paste">Click here</a>
				<span>&nbsp;to paste or&nbsp;</span>
				<a class="btn-cancel" href="#" @click="copyId = null">Cancel</a>
			</v-chip>

			<v-button :to="`/front-office/pages/${page}/widget/+`">Create Widget</v-button>
		</div>

		<router-view name="addWidget"></router-view>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Draggable from 'vuedraggable';
import WidgetItem from './widget-item.vue';
import { useWidgetStore } from '../../stores/widget';
import { useNotification } from '../../composables/use-notification';
import { storeToRefs } from 'pinia';

const route = useRoute();
const items = ref([]);
const store = useWidgetStore();
const { notify } = useNotification();
const { widgets, copyId } = storeToRefs(store);
const page = route.params.id as string;

store.hydrate(page);

watch(
	[widgets],
	() => {
		items.value = widgets.value.filter((item: any) => !item.parent);
	},
	{ immediate: true }
);

watch(
	() => route.name,
	() => {
		store.hydrate(page);
	},
	{ deep: true }
);

async function onSort(values) {
	store.sort(values, null);
}

async function paste() {
	await store.paste(page);
	notify({ title: 'Item pasted' });
}
</script>

<style lang="scss">
.widgets {
	max-width: 100%;

	h2 {
		margin-bottom: 12px;
	}

	.name {
		.instant-save {
			margin-left: 4px;
			color: var(--warning);
		}
	}

	.draggable-list {
		padding: 0;
		margin: 0 -12px;
	}

	.grid-col-full {
		grid-column: span 6 / span 6;
	}

	.grid-col-half {
		grid-column: span 3 / span 6;
	}

	.grid-col-1 {
		grid-column: span 1 / span 6;
	}

	.grid-col-2 {
		grid-column: span 2 / span 6;
	}

	.grid-col-3 {
		grid-column: span 3 / span 6;
	}

	.grid-col-4 {
		grid-column: span 4 / span 6;
	}

	.grid-col-5 {
		grid-column: span 5 / span 6;
	}

	.drag-handle {
		cursor: grab !important;
	}

	.widget-grid {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 8px 12px;
		padding: 12px;
	}

	.widget-select {
		margin: 2px 0px;
	}

	.btn-duplicate {
		// width: max-content;
		// margin: 0 auto;
		// margin-top: 8px;
		color: var(--foreground-subdued);
		transition: color var(--fast) var(--transition);

		&:hover {
			color: var(--foreground-normal);
		}
	}
	.widget-actions {
		display: grid;
		margin-top: 12px;
		gap: 24px;

		.btn-paste {
			color: var(--primary);

			&:hover {
				color: var(--primary-125);
			}
		}
		.btn-cancel {
			color: var(--foreground-normal-alt);
		}
	}
}
</style>
