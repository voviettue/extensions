import { useApi, useStores } from '@directus/extensions-sdk';
import { useNotification } from './use-notification';
import { useCollection } from '@directus/shared/composables';
import { getEndpoint } from '@directus/shared/utils';
import { computed, ComputedRef, Ref, ref, watch } from 'vue';

type UsableItem = {
	edits: Ref<Record<string, any>>;
	hasEdits: Ref<boolean>;
	item: Ref<Record<string, any> | null>;
	error: Ref<any>;
	loading: Ref<boolean>;
	saving: Ref<boolean>;
	refresh: () => void;
	save: () => Promise<any>;
	isNew: ComputedRef<boolean>;
	// remove: () => Promise<void>;
	// deleting: Ref<boolean>;
	getItem: () => Promise<void>;
	validationErrors: Ref<any[]>;
	listFields: ComputedRef<Record<string, any>>;
};

export function useItem(collection: string, primaryKey: string): UsableItem {
	const { info: collectionInfo } = useCollection(collection);
	const item = ref<Record<string, any> | null>(null);
	const error = ref<any>(null);
	const validationErrors = ref<any[]>([]);
	const loading = ref(false);
	const saving = ref(false);
	const deleting = ref(false);
	const edits = ref<Record<string, any>>({});
	const hasEdits = computed(() => Object.keys(edits.value).length > 0);
	const isNew = computed(() => primaryKey === '+');
	const isSingle = computed(() => !!collectionInfo.value?.meta?.singleton);
	const { notify } = useNotification();
	const { useFieldsStore } = useStores();
	const listFields = computed(() => {
		const fieldsStore = useFieldsStore();
		const fields = fieldsStore.getFieldsForCollection(collection);
		return fields;
	});

	const api = useApi();
	const VALIDATION_TYPES = ['FAILED_VALIDATION', 'RECORD_NOT_UNIQUE'];
	const itemEndpoint = computed(() => {
		if (isSingle.value) {
			return getEndpoint(collection);
		}
		return `${getEndpoint(collection)}/${encodeURIComponent(primaryKey as string)}`;
	});

	watch([collection, primaryKey], refresh, { immediate: true });

	return {
		edits,
		hasEdits,
		item,
		error,
		loading,
		saving,
		refresh,
		save,
		isNew,
		getItem,
		validationErrors,
		listFields,
	};

	async function getItem() {
		const params = { fields: ['*'] };
		listFields.value
			.filter((item: Record<string, any>) => item.meta.interface === 'list-m2m')
			.map((_: any) => params.fields.push(`${_.field}.*`));
		loading.value = true;
		error.value = null;
		try {
			const response = await api.get(itemEndpoint.value, { params });
			item.value = response.data.data;
		} catch (err: any) {
			error.value = err;
		} finally {
			loading.value = false;
		}
	}

	async function save() {
		saving.value = true;
		validationErrors.value = [];
		try {
			let response;
			if (isNew.value === true) {
				response = await api.post(getEndpoint(collection), edits.value);
				notify({
					title: 'Item created!',
				});
			} else {
				response = await api.patch(itemEndpoint.value, edits.value);
				notify({
					title: 'Item updated',
				});
			}

			item.value = response.data.data;
			edits.value = {};
			return response.data.data;
		} catch (err: any) {
			saveErrorHandler(err);
		} finally {
			saving.value = false;
		}
	}

	function saveErrorHandler(err: any) {
		if (err?.response?.data?.errors) {
			validationErrors.value = err.response.data.errors
				.filter((err: any) => VALIDATION_TYPES.includes(err?.extensions?.code))
				.map((err: any) => {
					return err.extensions;
				});
		}
		throw err;
	}

	function refresh() {
		error.value = null;
		loading.value = false;
		saving.value = false;
		deleting.value = false;

		if (isNew.value === true) {
			item.value = null;
		} else {
			getItem();
		}
	}
}
