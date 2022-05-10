import isNumber from 'lodash/isNumber';
import isEmpty from 'lodash/isEmpty';
import add from 'date-fns/add';
import getSeconds from 'date-fns/getSeconds';
import getMinutes from 'date-fns/getMinutes';
import getHours from 'date-fns/getHours';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import differenceInDays from 'date-fns/differenceInDays';
import differenceInMonths from 'date-fns/differenceInMonths';
import differenceInYears from 'date-fns/differenceInYears';
import differenceInHours from 'date-fns/differenceInHours';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import differenceInBusinessDays from 'date-fns/differenceInBusinessDays';

const parseDate = (date: any) => {
	return date instanceof Date ? date : new Date(date)
};

const functions = {
	CONCATENATE: (...args: any[]) => {
		return args.join('');
	},
	TRIM: (string: any) => {
		return String(string).trim();
	},
	LOWER(string: any) {
		return String(string).toLowerCase();
	},
	UPPER(string: any) {
		return String(string).toUpperCase();
	},
	LEN(string: any) {
		return String(string).length;
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
		const numbers = String(string).match(/\d+.\d+/g)
		return numbers ? parseFloat(String(numbers[0])) : '';
	},
	DATEADD(date: any, qty: number, unit = 'days') {
		if (isEmpty(date)) return '';
		const duration: any = {};
		duration[unit] = qty;
		return add(parseDate(date), duration);
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
	SECOND(date: any) {
		if (isEmpty(date)) return '';
		return getSeconds(parseDate(date));
	},
	MINUTE(date: any) {
		if (isEmpty(date)) return '';
		return getMinutes(parseDate(date));
	},
	HOUR(date: any) {
		if (isEmpty(date)) return '';
		return getHours(parseDate(date));
	},
	DAY(date: any) {
		if (isEmpty(date)) return '';
		return getDate(parseDate(date));
	},
	MONTH(date: any) {
		if (isEmpty(date)) return '';
		return getMonth(parseDate(date)) + 1;
	},
	YEAR(date: any) {
		if (isEmpty(date)) return '';
		return getYear(parseDate(date));
	},
	NOW() {
		return new Date();
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
