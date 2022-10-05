import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';
import uniq from 'lodash/uniq';

export default function (collection: Record<string, any>[]) {
	const dateFields: string[] = [];

	collection?.forEach((item: any) => {
		for (const [key, value] of Object.entries(item)) {
			if (isValid(parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()))) {
				dateFields.push(key);
			}
		}
	});

	return uniq(dateFields);
}
