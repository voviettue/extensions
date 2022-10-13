import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';

export default function (value: any) {
	if (typeof value !== 'string' && typeof value !== 'number') return null;

	const formats = ["yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", "yyyy-MM-dd'T'HH:mm:ss", 'yyyy-MM-dd'];

	if (typeof value === 'string') {
		for (const format of formats) {
			const parseDate = parse(value, format, new Date());
			if (isValid(parseDate)) return parseDate;
		}
	}

	if (String(value).length >= 8 && isValid(new Date(value))) {
		return new Date(value);
	}

	return null;
}
