import { MappedField } from './types';

export const mapFields = (item: any, mappedFields: Array<MappedField>): Record<string, any> => {
	const transformed: Record<string, any> = {};

	mappedFields.forEach((field: MappedField) => {
		if (field.field === null) {
			return;
		}
		transformed[field.field] = item[field.header];
	});

	return transformed;
};
