import isValid from 'date-fns/isValid';
import parse from 'date-fns/parse';

export default function (value: any) {
	if (typeof value !== 'string') return null;

	const formats = ["yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", "yyyy-MM-dd'T'HH:mm:ss", 'yyyy-MM-dd'];
	let date = null;

	for (const format of formats) {
		const parseDate = parse(value, format, new Date());
		if (isValid(parseDate)) {
			date = parseDate;
			break;
		}
	}

	return date;
}
