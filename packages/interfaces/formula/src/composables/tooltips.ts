/* eslint-disable prettier/prettier */
export default {
	CONCATENATE:
		'CONCATENATE(text1, text2, ...)' + '\n' + 'Example:' + '\n' + 'CONCATENATE("Bob"," - ", 43) => "Bob - 43"',
	TRIM: 'TRIM(text)' + '\n' + 'Example: TRIM("  Bob   ") => "Bob"',
	LOWER: 'LOWER(text)' + '\n' + 'Example: LOWER("Hello!") => "hello!"',
	UPPER: 'UPPER(text)' + '\n' + 'Example: UPPER("Hello!") => "hello!"',
	LEN: 'LEN(text)' + '\n' + 'Example: LEN("quick brown fox") => 15',
	AND: 'AND(text)' + '\n' + 'Example: AND(true, 1) => 1',
	IF:
		'IF(expression, ifTrue, ifFalse)' +
		'\n' +
		'Example: IF("a" != "b", "Please enter date", "Date entered") => "Please enter date"',
	OR: 'OR(expression1, expression2, ...)' + '\n' + 'Example: OR(0, 1) => 1',
	ABS: 'ABS(number)' + '\n' + 'Example: ABS(-5) => 5',
	COUNT: 'COUNT(number1, number2, ...)' + '\n' + 'Example: COUNT(1,2,3,"","four") => 3',
	AVERAGE: 'AVERAGE(number1, number2,...)' + '\n' + 'Example: AVERAGE(1,2,3,4,5) => 3',
	MAX: 'MAX(number1, number2, ...)' + '\n' + 'Example: MAX(10, 100) => 100',
	MIN: 'MIN(number1, number2, ...)' + '\n' + 'Example: MAX(10, 100) => 10',
	SUM: 'SUM(number1, number2, ...)' + '\n' + 'Example: SUM(1,2,3) => 6',
	VALUE: 'VALUE(text)' + '\n' + 'Example: VALUE("$1000") => 1000',
	DATEADD:
		'DATEADD(date, quantity, units)' +
		'\n' +
		'Example 1: DATEADD("2019-07-10", 10, "days") => 2019-07-20' +
		'\n' +
		'Example 2: DATEADD("2019-07-10", 1, "years") => 2020-07-10' +
		'\n' +
		'Example 3: DATEADD("2019-07-10T01:01:01", 60, "seconds") => 2019-07-10T01:02:01',
	DATESTR: 'DATESTR(date)' + '\n' + 'Example: DATESTR("12/13/21")=> 2021-12-13',
	DATETIME_DIFF:
		'DATETIME_DIFF(date1, date2, units)' +
		'\n' +
		'Example 1: DATETIME_DIFF("2019-07-10T12:00:00", "04/05/2019T11:00:00", "hours") => 25' +
		'\n' +
		'Example 2: DATETIME_DIFF("2019-06-04T12:00:00", "04/05/2019T11:00:00", "days") => 1',
	DATETIME_FORMAT:
		'DATETIME_FORMAT(date, format)' +
		'\n' +
		'Example 1: DATETIME_FORMAT("04/26/22", "yyyy") => 2022' +
		'\n' +
		'Example 2: DATETIME_FORMAT("04/26/22", "dd MM yyyy") => 26 04 2022',
	IS_AFTER: 'IS_AFTER(date1, date2)' + '\n' + 'Example: IS_AFTER("1/1/1979", "1/1/2000")=> 0',
	IS_BEFORE: 'IS_BEFORE(date1, date2)' + '\n' + 'Example: IS_BEFORE("1/1/1979", "1/1/2000")=> 1',
	IS_SAME: 'IS_SAME(date1, date2)' + '\n' + 'Example: IS_SAME("1/1/1979", "1/1/1979")=> 1',
	WEEKDAY: 'WEEKDAY(date, startDayOfWeek)' + '\n' + 'Example: WEEKDAY("2021-06-09") => 3 (for Wednesday)',
	WEEKNUM: 'WEEKNUM(date,startDayOfWeek )' + '\n' + 'Example: WEEKNUM("02/17/2013")=> 8',
	DAY: 'DAY(date)' + '\n' + 'Example: DAY("2022-02-15") => 15',
	HOUR: 'HOUR(date)' + '\n' + 'Example: HOUR("2022-02-15T07:30:15") => 7',
	MONTH: 'MONTH(date)' + '\n' + 'Example: MONTH("2022-02-15T07:30:15") => 2',
	SECOND: 'SECOND(date)' + '\n' + 'Example: SECOND("2022-02-15T07:30:15") => 15',
	MINUTE: 'MINUTE(date)' + '\n' + 'Example: MINUTE("2022-02-15T07:30:15") => 30',
	YEAR: 'YEAR(date)' + '\n' + 'Example: YEAR("2022-02-15T07:30:15") => 2022',
	NOW: 'NOW(date)' + '\n' + 'Example: NOW() => ' + new Date(),
	WORKDAY:
		'WORKDAY_DIFF(startDate, endDate, [holidays])' +
		'\n' +
		'Example: WORKDAY("10/16/20", 10, "2020-10-16", "2020-10-19")=> 2020-11-02',
	WORKDAY_DIFF:
		'WORKDAY_DIFF(startDate, endDate, [holidays])' +
		'\n' +
		'Example: WORKDAY_DIFF("2020-10-16","2020-11-02", "2020-10-16", "2020-10-19") => 15',
};
