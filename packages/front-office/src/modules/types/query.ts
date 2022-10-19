export type Query = {
	id: number;
	name?: string | null;
	options?: any;
	output?: object | string | null;
	refresh_on_load?: boolean;
	timeout?: number;
	query: 'item' | 'items' | 'api' | 'json' | 'js-object';
};
