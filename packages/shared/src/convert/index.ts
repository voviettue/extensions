import { format, parseISO } from 'date-fns';

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
	value: Date | string | undefined,
	type?: 'dateTime' | 'date' | 'timestamp'
): string | null => {
	if (!value) {
		return null;
	}

	try {
		const date = value instanceof Date ? value : parseISO(value);
		switch (type) {
			case 'date':
				return format(date, 'yyyy-MM-dd');
			default:
				return format(date, `yyyy-MM-dd'T'HH:mm:ss`);
		}
	} catch (err) {
		return null;
	}
};

export const convertData = (value: any, type: string) => {
	switch (type) {
		case 'json':
			return convertJson(value);
		case 'csv':
			return convertArray(value);
		case 'boolean':
			return convertBoolean(value);
		case 'integer':
			return convertInteger(value);
		case 'dateTime':
		case 'date':
		case 'timestamp':
			return convertDateTime(value, type);
		default:
			return value;
	}
};
