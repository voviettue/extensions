<template>
	<div class="field">
		<div class="type-label">Group By</div>
		<v-select v-model="groupByWriteable" :items="groupByFields" item-text="name" item-value="field" />
	</div>

	<!-- <div class="field">
		<div class="type-label">Group Title</div>
		<v-select
			v-model="groupTitleWriteable"
			placeholder="Please select Group By"
			:items="groupTitleFields" item-text="name" item-value="field"
		/>
	</div> -->

	<div class="field">
		<div class="type-label">Card Title</div>
		<v-field-template v-model="cardTitleWriteable" :collection="collection" />
	</div>

	<div class="field">
		<div class="type-label">Card Subtitle</div>
		<v-field-template v-model="cardSubtitleWriteable" :collection="collection" />
	</div>

	<div class="field">
		<div class="type-label">Card Tags</div>
		<v-select
			v-model="cardTagsWriteable"
			show-deselect
			placeholder="Optional Card Tags"
			:items="cardTagsFields"
			item-text="name"
			item-value="field"
		/>
	</div>

	<div class="field">
		<div class="type-label">Card Date</div>
		<v-select
			v-model="cardDateWriteable"
			show-deselect
			placeholder="Optional Card Date"
			:items="cardDateFields"
			item-text="name"
			item-value="field"
		/>
	</div>

	<div class="field">
		<div class="type-label">Card Image</div>
		<v-select
			v-model="cardImageWriteable"
			show-deselect
			placeholder="Optional Card Image"
			:items="cardImageFields"
			item-text="name"
			item-value="field"
		/>
	</div>

	<div class="field">
		<div class="type-label">Card Image Fit</div>
		<v-checkbox v-model="cardImageFitWriteable" label="Crop" block />
	</div>

	<div class="field">
		<div class="type-label">Card User</div>
		<v-select
			v-model="cardUserWriteable"
			show-deselect
			placeholder="Optional Card User"
			:items="cardUserFields"
			item-text="name"
			item-value="field"
		/>
	</div>

	<div class="field">
		<div class="type-label">Show Ungrouped</div>
		<v-checkbox v-model="showUngroupedWriteable" label="Show" block />
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Field } from '@directus/shared/types';
import { useSync } from '@directus/shared/composables';

export default defineComponent({
	inheritAttrs: false,
	props: {
		collection: {
			type: String,
			required: true,
		},
		template: {
			type: String,
			default: null,
		},
		collectionFields: {
			type: Array as PropType<Field[]>,
			required: true,
		},
		groupBy: {
			type: String,
			default: null,
		},
		groupByFields: {
			type: Array as PropType<Field[]>,
			required: true,
		},
		groupTitle: {
			type: String,
			default: null,
		},
		groupTitleFields: {
			type: Array as PropType<Field[]>,
			default: [],
		},
		cardTitle: {
			type: String,
			default: null,
		},
		cardTitleFields: {
			type: Array as PropType<Field[]>,
			default: [],
		},
		cardSubtitle: {
			type: String,
			default: null,
		},
		cardSubtitleFields: {
			type: Array as PropType<Field[]>,
			default: [],
		},
		cardTags: {
			type: String,
			default: null,
		},
		cardTagsFields: {
			type: Array as PropType<Field[]>,
			default: [],
		},
		cardDate: {
			type: String,
			default: null,
		},
		cardDateFields: {
			type: Array as PropType<Field[]>,
			default: [],
		},
		cardImage: {
			type: String,
			default: null,
		},
		cardImageFields: {
			type: Array as PropType<Field[]>,
			default: [],
		},
		cardImageFit: {
			type: Boolean,
			default: true,
		},
		cardUser: {
			type: String,
			default: null,
		},
		cardUserFields: {
			type: Array as PropType<Field[]>,
			required: true,
		},
		showUngrouped: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'update:groupBy',
		'update:groupTitle',
		'update:cardTitle',
		'update:cardSubtitle',
		'update:cardTags',
		'update:cardDate',
		'update:cardImage',
		'update:cardImageFit',
		'update:cardUser',
		'update:showUngrouped',
	],
	setup(props, { emit }) {
		const groupByWriteable = useSync(props, 'groupBy', emit);
		const groupTitleWriteable = useSync(props, 'groupTitle', emit);
		const cardTitleWriteable = useSync(props, 'cardTitle', emit);
		const cardSubtitleWriteable = useSync(props, 'cardSubtitle', emit);

		const cardTagsWriteable = useSync(props, 'cardTags', emit);
		const cardDateWriteable = useSync(props, 'cardDate', emit);
		const cardImageWriteable = useSync(props, 'cardImage', emit);
		const cardImageFitWriteable = useSync(props, 'cardImageFit', emit);
		const cardUserWriteable = useSync(props, 'cardUser', emit);
		const showUngroupedWriteable = useSync(props, 'showUngrouped', emit);

		return {
			groupByWriteable,
			groupTitleWriteable,
			cardTitleWriteable,
			cardSubtitleWriteable,
			cardTagsWriteable,
			cardDateWriteable,
			cardImageWriteable,
			cardImageFitWriteable,
			cardUserWriteable,
			showUngroupedWriteable,
		};
	},
});
</script>
