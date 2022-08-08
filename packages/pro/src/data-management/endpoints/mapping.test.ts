import { mapFields } from './mapping';

describe('test transform', () => {
	const input = {
		ID: '001',
		Name: 'John',
		Age: 2,
		'Test Header': null,
	};
	const expected = {
		id: '001',
		name: 'John',
		not_age: 2,
		test: null,
	};
	const mappedFields = [
		{ field: 'id', header: 'ID' },
		{ field: 'name', header: 'Name' },
		{ field: null, header: 'Address' },
		{ field: 'not_age', header: 'Age' },
		{ field: 'test', header: 'Test Header' },
	];

	it('should transform data', () => {
		expect(mapFields(input, mappedFields)).toMatchObject(expected);
	});
});
