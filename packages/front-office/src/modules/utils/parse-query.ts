import parseJson from './parse-json';
import { Query } from '../types/query';

export function parseQuery(query: Query) {
	if (typeof query.output === 'object') return query.output;
	try {
		switch (query.query) {
			case 'js-object':
				// eslint-disable-next-line no-new-func
				return new Function(`return ${query.output}`)() || null;
			case 'api':
			case 'item':
			case 'json':
			case 'items':
				return parseJson(query.output!) || [];
			default:
				return query.output;
		}
	} catch {
		return null;
	}
}
