import isNumber from 'lodash/isNumber';
import isNil from 'lodash/isNil';
import add from 'date-fns/add';
import getSeconds from 'date-fns/getSeconds';
import getMinutes from 'date-fns/getMinutes';
import getHours from 'date-fns/getHours';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import format from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInMonths from 'date-fns/differenceInMonths';
import differenceInYears from 'date-fns/differenceInYears';
import differenceInHours from 'date-fns/differenceInHours';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import differenceInBusinessDays from 'date-fns/differenceInBusinessDays';
import { getWeek } from 'date-fns';
import getDay from 'date-fns/getDay';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import { daysInWeek, parseDate } from './utils';

const functions = {
	CONCATENATE: (...args: any[]) => {
		return args.join('');
	},
	TRIM: (string: any) => {
		return isNil(string) ? '' : String(string).trim();
	},
	LOWER(string: any) {
		return isNil(string) ? '' : String(string).toLowerCase();
	},
	UPPER(string: any) {
		return isNil(string) ? '' : String(string).toUpperCase();
	},
	LEN(string: any) {
		return isNil(string) ? '' : String(string).length;
	},
	AND(...expressions: any) {
		const result = expressions.reduce(
			(previousExpression: any, currentExpression: any) => currentExpression && previousExpression
		);
		return result ? 1 : 0;
	},
	IF(expression: any, ifTrue: any, ifFalse: any) {
		return expression ? ifTrue : ifFalse;
	},
	OR(...expressions: any) {
		const result = expressions.reduce(
			(previousExpression: any, currentExpression: any) => currentExpression || previousExpression
		);
		return result ? 1 : 0;
	},
	ABS(number: any) {
		return Math.abs(number);
	},
	COUNT(...args: any[]) {
		return args.filter((item): any => isNumber(item)).length;
	},
	AVERAGE(...args: any[]) {
		const sum = args.reduce((result: number, item: any) => {
			const value = isNumber(item) ? item : 0;
			return result + value;
		}, 0);
		return sum / args.length;
	},
	MAX(...args: any[]) {
		return Math.max(...args);
	},
	MIN: (...args: any[]) => {
		return Math.min(...args);
	},
	SUM: (...args: any[]) => {
		return args.reduce((result: number, item: any) => {
			const value = isNumber(item) ? item : 0;
			return result + value;
		}, 0);
	},
	VALUE(string: any) {
		const numbers = isNil(string) ? '' : String(string).match(/\d+.\d+/g);
		return numbers ? parseFloat(String(numbers[0])) : '';
	},
	DATEADD(date: any, qty: number, unit = 'days') {
		if (!date) return '';
		const duration: any = {};
		duration[unit] = qty;
		return add(parseDate(date), duration);
	},
	DATESTR(date: any) {
		if (!date) return '';

		return format(parseDate(date), 'yyyy-MM-dd');
	},
	DATETIME_DIFF(dateLeft: any, dateRight: any, unit = 'days') {
		if (!dateLeft || !dateRight) return '';
		const map: any = {
			days: differenceInDays,
			months: differenceInMonths,
			years: differenceInYears,
			hours: differenceInHours,
			minutes: differenceInMinutes,
			seconds: differenceInSeconds,
		};

		return map[unit] ? map[unit](parseDate(dateRight), parseDate(dateLeft)) : '';
	},
	DATETIME_FORMAT(date: any, formatDate: any = 'yyyy-MM-DD') {
		if (!date) return '';
		return format(parseDate(date), formatDate);
	},
	IS_AFTER(date1: any, date2: any) {
		if (!date1) return '';
		if (!date2) return '';

		return parseDate(date1).getTime() > parseDate(date2).getTime() ? 1 : 0;
	},
	IS_BEFORE(date1: any, date2: any) {
		if (!date1) return '';
		if (!date2) return '';

		return parseDate(date1).getTime() < parseDate(date2).getTime() ? 1 : 0;
	},
	IS_SAME(date1: any, date2: any) {
		if (!date1) return '';
		if (!date2) return '';

		return parseDate(date1).getTime() == parseDate(date2).getTime() ? 1 : 0;
	},
	WEEKDAY(date: any, startDayOfWeek: any) {
		if (!date) return '';
		let days = startDayOfWeek || 0;
		if (typeof startDayOfWeek === 'string') {
			const dayName: any = String(startDayOfWeek).toLowerCase();
			days = daysInWeek.includes(dayName) ? daysInWeek.indexOf(dayName) : 0;
		}
		if (days < 0 || days > 6) return '';

		return getDay(subDays(parseDate(date), days));
	},
	WEEKNUM(date: any, startDayOfWeek: any) {
		if (!date) return '';
		let startOn = startDayOfWeek || 0;
		if (typeof startDayOfWeek === 'string') {
			const dayName: any = String(startDayOfWeek).toLowerCase();
			startOn = daysInWeek.includes(dayName) ? daysInWeek.indexOf(dayName) : 0;
		}
		if (startDayOfWeek < 0 || startDayOfWeek > 6) return '';

		return getWeek(parseDate(date), { weekStartsOn: startOn });
	},
	SECOND(date: any) {
		if (!date) return '';
		return getSeconds(parseDate(date));
	},
	MINUTE(date: any) {
		if (!date) return '';
		return getMinutes(parseDate(date));
	},
	HOUR(date: any) {
		if (!date) return '';
		return getHours(parseDate(date));
	},
	DAY(date: any) {
		if (!date) return '';
		return getDate(parseDate(date));
	},
	MONTH(date: any) {
		if (!date) return '';
		return getMonth(parseDate(date)) + 1;
	},
	YEAR(date: any) {
		if (!date) return '';
		return getYear(parseDate(date));
	},
	NOW() {
		return format(new Date(), 'yyyy-MM-dd');
	},
	WORKDAY(date: any, numDays: any, ...holidays: any[]) {
		if (!date) return '';
		if (!parseDate(date)) return '';
		if (typeof numDays !== 'number' || numDays < 0) return '';

		const strHolidays = holidays.filter((e) => !!parseDate(e)).map((e) => parseDate(e).toDateString());
		let nextDate = parseDate(date);
		let days = numDays;

		while (days > 0) {
			nextDate = addDays(nextDate, 1);

			if (strHolidays.includes(nextDate.toDateString())) continue;
			if ([0, 6].includes(getDay(nextDate))) continue;

			--days;
		}

		return format(nextDate, 'yyyy-MM-dd');
	},
	WORKDAY_DIFF(dateLeft: any, dateRight: any, ...holidays: any[]) {
		if (!dateLeft || !dateRight) return '';
		const dateL = parseDate(dateLeft);
		const dateR = parseDate(dateRight);

		let count = differenceInBusinessDays(dateR, dateL);

		holidays.forEach((date) => {
			if (dateL <= parseDate(date) && dateR >= parseDate(date)) {
				count -= 1;
			}
		});

		return count;
	},
};

export default functions;
