import { RecurringSettings } from './types';
import { getItemsCount } from './utils';

type RecurringSettingsTestCase = RecurringSettings & {
	expected: number;
};

describe('getItemsCount()', () => {
	it('should get item count', () => {
		const testCases: Array<RecurringSettingsTestCase> = [
			{
				repeat: 1,
				frequency: 'daily',
				start: new Date('2022-06-17'),
				until: new Date('2023-06-17'),
				expected: 365,
			},
			{
				repeat: 1,
				frequency: 'weekly',
				start: new Date('2022-06-17'),
				until: new Date('2023-06-17'),
				expected: 52,
			},
			{
				repeat: 1,
				frequency: 'monthly',
				start: new Date('2022-06-17'),
				until: new Date('2023-06-17'),
				expected: 12,
			},
			{
				repeat: 2,
				frequency: 'daily',
				start: new Date('2022-06-17'),
				until: new Date('2022-07-17'),
				expected: 15,
			},
			{
				repeat: 2,
				frequency: 'weekly',
				start: new Date('2022-06-17'),
				until: new Date('2022-07-17'),
				expected: 2,
			},
			{
				repeat: 1,
				frequency: 'daily',
				start: new Date('2022-06-17'),
				until: new Date('2022-07-17'),
				expected: 30,
			},
			{
				repeat: 4,
				frequency: 'monthly',
				start: new Date('2022-06-17'),
				until: new Date('2023-01-17'),
				expected: 1,
			},
			{
				repeat: 1,
				frequency: 'daily',
				start: new Date('2022-06-17'),
				until: new Date('2022-06-16'),
				expected: 0,
			},
		];

		testCases.forEach((tc) => {
			expect(
				getItemsCount({
					repeat: tc.repeat,
					frequency: tc.frequency as RecurringSettings['frequency'],
					start: tc.start,
					until: tc.until,
				})
			).toBe(tc.expected);
		});
	});
});
