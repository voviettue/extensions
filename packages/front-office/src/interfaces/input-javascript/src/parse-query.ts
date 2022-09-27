type Query = {
	id: number;
	name?: string | null;
	options?: any;
	output?: string | null;
	refresh_on_load?: boolean;
	timeout?: number;
	query: 'item' | 'items' | 'api' | 'json' | 'js-object';
};

export function parseQuery(query: Query) {
	try {
		switch (query.query) {
			case 'js-object':
				// eslint-disable-next-line no-new-func
				return new Function(`return ${query.output}`)() || null;
			case 'api':
			case 'item':
			case 'json':
			case 'items':
				return JSON.parse(query.output!) || null;
			default:
				return query.output;
		}
	} catch {
		return null;
	}
}
