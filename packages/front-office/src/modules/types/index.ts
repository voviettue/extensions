export * from './extensions';
export * from './query';

export interface Widget {
	id: number;
	name: string;
	key: string;
	options: Record<string, any>;
	widget: string;
	sort: number;
	icon: string;
	hidden: boolean;
	custom_css: string;
	html_class: string;
	width: string;
	page: string;
	parent: number;
}

export interface Tab {
	key: string;
	label: string;
	icon: string;
	hidden: boolean;
	widgets: number[];
}
