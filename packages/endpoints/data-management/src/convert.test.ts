import { convertInteger, convertBoolean, convertArray, convertJson, convertDateTime } from './convert';

describe('test convert integer', () => {
	test('should convert integer', () => {
		expect(convertInteger('1')).toBe(1);
		expect(convertInteger('-1')).toBe(-1);
		expect(convertInteger('0')).toBe(0);
		expect(convertInteger('-0')).toBe(0);
		expect(convertInteger('1.1')).toBe(1);
		expect(convertInteger('-1.1')).toBe(-1);
		expect(convertInteger('1.1.1')).toBe(1);
		expect(convertInteger('-1.1.1')).toBe(-1);
		expect(convertInteger('')).toBe(null);
	});
});

describe('test convert boolean', () => {
	test('should convert boolean', () => {
		expect(convertBoolean('1')).toBe(true);
		expect(convertBoolean('-1')).toBe(true);
		expect(convertBoolean('true')).toBe(true);
		expect(convertBoolean('yes')).toBe(true);
		expect(convertBoolean('o')).toBe(true);
		expect(convertBoolean('y')).toBe(true);

		expect(convertBoolean('0')).toBe(false);
		expect(convertBoolean('false')).toBe(false);
		expect(convertBoolean('no')).toBe(false);
		expect(convertBoolean('x')).toBe(false);
		expect(convertBoolean('n')).toBe(false);
	});
});

describe('test convert array', () => {
	test('should convert array', () => {
		expect(convertArray('1,2,3')).toEqual(['1', '2', '3']);
		expect(convertArray('1, 2, 3, 4')).toEqual(['1', '2', '3', '4']);
		expect(convertArray('')).toBe('');
		expect(convertArray(undefined)).toBe(undefined);
	});
});

describe('test convert json', () => {
	test('should convert json', () => {
		expect(convertJson('{"a": 1}')).toEqual({ a: 1 });
		expect(convertJson('{"a": 1, "b": 2}')).toEqual({ a: 1, b: 2 });
		expect(convertJson('1x')).toBe('1x');
		expect(convertJson('')).toBe('');
		expect(convertJson(undefined)).toBe(undefined);
	});
});

describe('test convert date time', () => {
	test('should convert date time', () => {
		expect(convertDateTime('abc')).toBe(null);
		expect(convertDateTime('2022-06-09T16:25:00')).toBe('2022-06-09T16:25:00');
		expect(convertDateTime('2022-06-09T16:25:00', 'date')).toBe('2022-06-09');
		expect(convertDateTime('2022-06-09T16:25:00', 'time')).toBe('16:25:00');
		expect(convertDateTime('2022-06-09T16:25:00', 'timestamp')).toBe('2022-06-09T16:25:00');
	});
});
