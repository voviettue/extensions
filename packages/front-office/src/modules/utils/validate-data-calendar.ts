import isEqual from 'lodash/isEqual';

export default function (collection: any) {
	if (!collection || !Array.isArray(collection) || collection?.length === 0) return false;

	const idValid = collection.find((e: {}) => {
		return !isEqual(Object.keys(collection[0]), Object.keys(e));
	});

	return !idValid;
}
