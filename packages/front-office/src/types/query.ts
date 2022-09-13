export type Query = {
	id: number;
	name: string | null;
	options: any;
	output: string;
	refresh_on_load: boolean;
	timeout: number;
	query: 'items' | 'api' | 'json';
};
