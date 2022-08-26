import { differenceInDays, differenceInWeeks, differenceInMonths } from 'date-fns';
import { RecurringSettings } from './types';

export function getItemsCount(settings: RecurringSettings): number {
	let count = 0;

	switch (settings.frequency) {
		case 'daily':
			count = differenceInDays(settings.until, settings.start);
			break;
		case 'weekly':
			count = differenceInWeeks(settings.until, settings.start);
			break;
		case 'monthly':
			count = differenceInMonths(settings.until, settings.start);
			break;
	}

	return count < 0 ? 0 : Math.floor(count / settings.repeat);
}
