import { Field, Relation } from '@directus/shared/types';
import { Collection } from '../types';

export type RelationM2M = {
	relation: Relation;
	relatedCollection: Collection;
	relatedPrimaryKeyField: Field;
	junctionCollection: Collection;
	junctionPrimaryKeyField: Field;
	junctionField: Field;
	reverseJunctionField: Field;
	junction: Relation;
	sortField?: string;
	type: 'm2m';
};

/*
One1              Many|Many: junctionCollection         One2: relatedCollection
┌─────────┐       ┌─────────────────────────────┐       ┌─────────────────────┐
│id       ├───┐   │id: junctionPKField          │   ┌───┤id: relatedPKField   │
│many     │   └──►│one1_id: reverseJunctionField│   │   │                     │
└─────────┘       │one2_id: junctionField       │◄──┘   └─────────────────────┘
									│sort: sortField              │
									└─────────────────────────────┘
 */

export function useRelationM2M(
	collection: string,
	field: string,
	{ useCollectionsStore, useFieldsStore, useRelationsStore }: any
) {
	const relationsStore = useRelationsStore();
	const collectionsStore = useCollectionsStore();
	const fieldsStore = useFieldsStore();

	const relations = relationsStore.getRelationsForField(collection, field);

	const junction = relations.find(
		(relation: any) =>
			relation.related_collection === collection && relation.meta?.one_field === field && relation.meta.junction_field
	);

	if (!junction) return undefined;

	const relation = relations.find(
		(relation: any) => relation.collection === junction.collection && relation.field === junction.meta?.junction_field
	);

	if (!relation) return undefined;

	return {
		relation: relation,
		relatedCollection: collectionsStore.getCollection(relation.related_collection as string),
		relatedPrimaryKeyField: fieldsStore.getPrimaryKeyFieldForCollection(relation.related_collection as string),
		sortField: junction.meta?.sort_field ?? undefined,
		junctionCollection: collectionsStore.getCollection(junction.collection),
		junctionPrimaryKeyField: fieldsStore.getPrimaryKeyFieldForCollection(junction.collection),
		junctionField: fieldsStore.getField(junction.collection, junction.meta?.junction_field as string),
		reverseJunctionField: fieldsStore.getField(junction.collection, relation.meta?.junction_field as string),
		junction: junction,
		type: 'm2m',
	} as RelationM2M;
}
