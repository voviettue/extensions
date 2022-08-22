export const useValidate = () => ({
	validateItem: (data: Record<string, any>, form: Record<string, any>[]): Record<string, any>[] => {
		const errors = [];
		for (const item of form) {
			const key = item.field;
			const collection = item?.collection || undefined;
			if (item.meta.required && !data[key]) {
				errors.push({ field: key, type: 'required', hidden: false, group: null, collection });
			}
		}
		return errors;
	},
});
