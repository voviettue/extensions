export type LayoutOptions = {
	template?: string;
	startDateField?: string;
	endDateField?: string;
	groupField?: string;
	titleField?: string;
	userField?: string;
	tagField?: string;
	viewInfo?: {
		type: string;
		startDate: Date;
		endDate: Date;
		zoom: number;
	};
	conditionalStyles: any[];
};
