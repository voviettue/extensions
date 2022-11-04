import isJson from './is-json';

export default function parseResponse(response: any) {
	const cache: string[] = [];
	const data = JSON.stringify(response, (key, value) => {
		if (typeof value === 'object' && value !== null) {
			// Duplicate reference found, discard key
			if (cache.includes(value)) return;

			// Store value in our collection
			cache.push(value);
		}
		return value;
	});

	return isJson(data) ? JSON.parse(data) : data;
}
