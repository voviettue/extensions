export type LayoutQuery = {
	fields: string[];
	sort: string[];
	limit: number;
	page: number;
};

export type LayoutOptions = {
	groupBy?: string,
	groupTitle?: string,
	cardTitle?: string,
	cardSubtitle?: string,
	cardTags?: string,
	cardDate?: string,
	cardImage?: string,
	cardImageFit?: boolean,
	cardUser?: string,
	showUngrouped?: boolean,
};
