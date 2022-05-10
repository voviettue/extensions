import { useStores } from '@directus/extensions-sdk';
import { getRelationType } from '@directus/shared/utils';
import { ref, watch } from 'vue';

export function useFieldTree(collection, inject, filter = () => true) {
	const { useFieldsStore, useRelationsStore } = useStores();
	const fieldsStore = useFieldsStore();
	const relationsStore = useRelationsStore();
	const treeList = ref([]);
	const visitedPaths = ref(new Set());

	watch(() => collection.value, refresh, { immediate: true });

	return { treeList, loadFieldRelations };

	function refresh(collection) {
		var _a;
		visitedPaths.value = new Set();
		treeList.value = (_a = getTree(collection)) !== null && _a !== void 0 ? _a : [];
		for (const node of treeList.value) {
			node.children = getTree(node.relatedCollection, node);
		}
	}

	function getTree(collection, parent) {
		var _a;
		const injectedFields = (_a = inject === null || inject === void 0 ? void 0 : inject.value) === null || _a === void 0 ? void 0 : _a.fields.filter((field) => field.collection === collection);
		const fields = fieldsStore
			.getFieldsForCollection(collection)
			.concat(injectedFields || [])
			.filter((field) => {
				var _a, _b, _c, _d, _e, _f;
				return ((_b = (_a = field.meta) === null || _a === void 0 ? void 0 : _a.special) === null || _b === void 0 ? void 0 : _b.includes('group')) ||
					(!((_d = (_c = field.meta) === null || _c === void 0 ? void 0 : _c.special) === null || _d === void 0 ? void 0 : _d.includes('alias')) && !((_f = (_e = field.meta) === null || _e === void 0 ? void 0 : _e.special) === null || _f === void 0 ? void 0 : _f.includes('no-data')));
			});
		const nonGroupFields = fields.filter((field) => { var _a; return !((_a = field.meta) === null || _a === void 0 ? void 0 : _a.group); });
		const sortGroupFields = (a, b) => {
			var _a, _b;
			if (!((_a = a.meta) === null || _a === void 0 ? void 0 : _a.sort) || !((_b = b.meta) === null || _b === void 0 ? void 0 : _b.sort))
				return 0;
			return a.meta.sort - b.meta.sort;
		};

		for (const [index, field] of nonGroupFields.entries()) {
			const groupFields = fields.filter((groupField) => { var _a; return ((_a = groupField.meta) === null || _a === void 0 ? void 0 : _a.group) === field.field; });
			if (groupFields.length) {
				nonGroupFields.splice(index + 1, 0, ...groupFields.sort(sortGroupFields));
			}
		}

		const sortedFields = nonGroupFields
			.filter((field) => { var _a, _b, _c, _d; return !((_b = (_a = field.meta) === null || _a === void 0 ? void 0 : _a.special) === null || _b === void 0 ? void 0 : _b.includes('alias')) && !((_d = (_c = field.meta) === null || _c === void 0 ? void 0 : _c.special) === null || _d === void 0 ? void 0 : _d.includes('no-data')); })
			.filter(filter)
			.flatMap((field) => makeNode(field, parent));

		return sortedFields.length ? sortedFields : undefined;
	}

	function makeNode(field, parent) {
		const relatedCollections = getRelatedCollections(field);
		const context = parent ? parent.key + '.' : '';
		if (relatedCollections.length <= 1) {
			return {
				name: field.name,
				field: field.field,
				collection: field.collection,
				relatedCollection: relatedCollections[0],
				key: context + field.field,
			};
		}

		return relatedCollections.map((collection) => {
			return {
				name: `${field.name} (${collection})`,
				field: `${field.field}:${collection}`,
				collection: field.collection,
				relatedCollection: collection,
				key: context + `${field.field}:${collection}`,
			};
		});
	}

	function getRelatedCollections(field) {

		const relation = getRelationForField(field);

		if (!(relation === null || relation === void 0 ? void 0 : relation.meta))
			return [];
		const relationType = getRelationType({ relation, collection: field.collection, field: field.field });
		switch (relationType) {
			case 'o2m':
				return [relation.meta.many_collection];
			case 'm2o':
				return [relation.meta.one_collection];
			case 'm2a':
				return relation.meta.one_allowed_collections;
			default:
				return [];
		}
	}

	function getRelationForField(field) {
		var _a;

		const relations = [
			...relationsStore.getRelationsForField(field.collection, field.field),
			...(((_a = inject === null || inject === void 0 ? void 0 : inject.value) === null || _a === void 0 ? void 0 : _a.relations) || []),
		];

		return relations.find((relation) => {
			var _a;
			return (relation.collection === field.collection && relation.field === field.field) ||
				(relation.related_collection === field.collection && ((_a = relation.meta) === null || _a === void 0 ? void 0 : _a.one_field) === field.field);
		});
	}

	function getNodeAtPath([field, ...path], root) {
		for (const node of root || []) {
			if (node.field === field) {
				if (path.length) {
					return getNodeAtPath(path, node.children);
				}
				else {
					return node;
				}
			}
		}
	}

	function loadFieldRelations(path) {
		if (!visitedPaths.value.has(path)) {
			visitedPaths.value.add(path);
			const node = getNodeAtPath(path.split('.'), treeList.value);
			for (const child of (node === null || node === void 0 ? void 0 : node.children) || []) {
				child.children = getTree(child.relatedCollection, child);
			}
		}
	}
}
