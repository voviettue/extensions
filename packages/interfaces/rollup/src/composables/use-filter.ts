import { Filter } from '@directus/shared/types';

function joinFields(keys: any, filter: Filter, fields: any = []) {
	if (!filter) return keys;

	const key = Object.keys(filter)?.[0];
	const subFilter = Object.values(filter)[0];

	if (key && ['_and', '_or'].includes(key)) {
		const expandFields = getFields(filter);
		for (const expandField of expandFields) {
			fields.push(expandField);
		}
	}

	if (key && !key.startsWith('_')) {
		keys.push(key);

		joinFields(keys, subFilter, fields);
		return;
	}

	fields.push(keys);
}

export function getFields(filter: Filter): any[] {
	if (!filter) return [];

	const fields: any = [];

	if (['_and', '_or'].includes(Object.keys(filter)[0])) {
		const subFilters = Object.values(filter)[0] as Filter[];
		for (filter of subFilters) {
			joinFields([], filter, fields);
		}
	}

	return fields.map((keys: any) => (Array.isArray(keys) ? keys?.join('.') : keys));
}
