export type Query = {
	id: number;
	name?: string | null;
	options?: any;
	output?: string | null;
	refresh_on_load?: boolean;
	timeout?: number;
	query: 'item' | 'items' | 'api' | 'json' | 'js-object';
	params: Array<{ name: string; value: string }>;
};
