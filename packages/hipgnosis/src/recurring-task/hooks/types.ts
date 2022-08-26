export type Frequency = 'daily' | 'weekly' | 'monthly';

export type RecurringSettings = {
	repeat: number;
	frequency: Frequency;
	start: Date;
	until: Date;
};
