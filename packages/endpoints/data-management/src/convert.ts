import { format, parseISO } from 'date-fns';

export const convertData = (value: Record<string, string>, fields: any): Record<string, any> => {
	const converted: Record<string, any> = {};
	Object.keys(value).forEach((k) => {
		const field = fields.find((f: any) => f.field === k);
		if (field) {
			switch (field.type) {
				case 'json':
				case 'csv':
				case 'alias':
					converted[k] = convertJson(value[k]);
					if (!Array.isArray(converted[k])) {
						converted[k] = convertArray(converted[k]);
					}
					break;
				case 'boolean':
					converted[k] = convertBoolean(value[k]);
					break;
				case 'integer':
					converted[k] = convertInteger(value[k]);
					break;
				case 'dateTime':
				case 'date':
				case 'time':
				case 'timestamp':
					converted[k] = convertDateTime(value[k], field.type);
					break;
				default:
					converted[k] = value[k];
			}
		}
	});

	return converted;
};

export const convertArray = (value: string | undefined) => {
	if (!value) {
		return value;
	}

	return value.split(',').map((e) => e.trim());
};

export const convertJson = (value: string | undefined) => {
	if (!value) {
		return value;
	}

	try {
		return JSON.parse(value);
	} catch (err) {
		return value;
	}
};

export const convertBoolean = (value: string | undefined): boolean => {
	if (!value) {
		return false;
	}

	if (['1', 'TRUE', 'YES', 'Y', 'O'].includes(String(value).toUpperCase())) {
		return true;
	}

	if (['0', 'FALSE', 'NO', 'N', 'X'].includes(String(value).toUpperCase())) {
		return false;
	}

	return true;
};

export const convertInteger = (value: string | undefined): number | null => {
	if (!value) {
		return null;
	}

	if (value === '-0') {
		return 0;
	}

	return parseInt(value);
};

export const convertDateTime = (
	value: string | undefined,
	type?: 'dateTime' | 'date' | 'time' | 'timestamp'
): string | null => {
	if (!value) {
		return null;
	}

	try {
		const date = parseISO(value);

		switch (type) {
			case 'date':
				return format(date, 'yyyy-MM-dd');
			case 'time':
				return format(date, 'HH:mm:ss');
			default:
				return format(date, `yyyy-MM-dd'T'HH:mm:ss`);
		}
	} catch (err) {
		return null;
	}
};

export default {
	convertArray,
	convertJson,
	convertBoolean,
	convertInteger,
	convertDateTime,
};
