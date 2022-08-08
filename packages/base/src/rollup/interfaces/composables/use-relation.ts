import { useRelationO2M } from './use-relation-o2m';
import { useRelationM2M } from './use-relation-m2m';

export function useRelation(collection: string, fieldKey: string, stores: any) {
	const { useFieldsStore } = stores;
	const fieldsStore = new useFieldsStore();

	const field = fieldsStore.getField(collection, fieldKey ?? '');

	if (!field) return undefined;

	if (field.meta?.special?.includes('m2m')) {
		return useRelationM2M(field.collection, field.field, stores);
	}

	if (field.meta?.special?.includes('o2m')) {
		return useRelationO2M(field.collection, field.field, stores);
	}

	return undefined;
}
