import { Field } from '@directus/shared/types';

export default function adjustFieldsForDisplays(
	fieldsStore: any,
	fields: string[],
	parentCollection: string
): string[] {
	const adjustedFields: string[] = fields
		.map((fieldKey) => {
			const field: Field | null = fieldsStore.getField(parentCollection, fieldKey);

			if (!field) return fieldKey;
			if (!field.meta?.display_options?.template) return fieldKey;

			const fieldKeys: string[] = [];
			const template = field.meta?.display_options?.template;
			const regex = /({{.*?}})/g;
			template.split(regex).forEach((part: string) => {
				if (part.startsWith('{{') === false) return;

				const key = part.replace(/{{/g, '').replace(/}}/g, '').trim();
				fieldKeys.push(`${fieldKey}.${key}`);
			});

			if (fieldKeys.length) {
				return fieldKeys;
			}

			return fieldKey;
		})
		.flat();

	return adjustedFields;
}
