export default function errorHandler(err: any, collectionInfo: any): any[] {
	const VALIDATION_TYPES = ['FAILED_VALIDATION', 'RECORD_NOT_UNIQUE', 'VALUE_TOO_LONG'];
	if (err?.response?.data?.errors) {
		return err.response.data.errors
			.filter((err: any) => VALIDATION_TYPES.includes(err?.extensions?.code))
			.map((err: any) => {
				const { code, collection, field } = err.extensions;
				const error: Record<string, any> = {};
				error.field = (collection ?? '' + field ?? '').replace(collectionInfo?.collection.replace('_', ''), '');
				switch (code) {
					case 'RECORD_NOT_UNIQUE':
						error.type = 'unique';
						break;
					case 'FAILED_VALIDATION':
						error.type = 'nin';
						break;
					case 'VALUE_TOO_LONG':
						error.type = 'lt';
						error.valid = '50 characters';
						break;
				}
				return error;
			});
	}
	throw err;
}
