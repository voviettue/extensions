import { Field, Relation } from '@directus/shared/types';
import { Collection } from '../types';

export type RelationO2M = {
	relation: Relation;
	relatedCollection: Collection;
	relatedPrimaryKeyField: Field;
	reverseJunctionField: Field;
	sortField?: string;
	type: 'o2m';
};

export function useRelationO2M(
	collection: string,
	field: string,
	{ useCollectionsStore, useFieldsStore, useRelationsStore }: any
) {
	const relationsStore = useRelationsStore();
	const collectionsStore = useCollectionsStore();
	const fieldsStore = useFieldsStore();

	/**
	@example
	Many                 One: relatedCollection
	┌──────────┐         ┌──────────────────────────────┐
	│id        ├────┐    │id: relatedPKField            │
	│many      │    └───►│many_id: reverseJunctionField │
	└──────────┘         │sort: sortField               │
								 └──────────────────────────────┘
	*/

	const relations = relationsStore.getRelationsForField(collection, field);

	if (relations.length !== 1) return undefined;

	const relation = relations[0];

	return {
		relation: relation,
		relatedCollection: collectionsStore.getCollection(relation.collection),
		relatedPrimaryKeyField: fieldsStore.getPrimaryKeyFieldForCollection(relation.collection),
		reverseJunctionField: fieldsStore.getField(relation.collection, relation.meta?.many_field as string),
		sortField: relation.meta?.sort_field ?? undefined,
		type: 'o2m',
	} as RelationO2M;
}
