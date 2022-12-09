import axios from 'axios';
import { ApiExtensionContext } from '@directus/shared/types';
import { BaseException } from '@directus/shared/exceptions';

async function docs(req: any, res: any, ctx: ApiExtensionContext) {
	const doc_id = req.params?.id;
	try {
		const { InvalidPayloadException } = ctx.exceptions;

		if (!doc_id) {
			throw new InvalidPayloadException('missing doc id');
		}

		const url = `${process.env.LEDGER_URL}/v1/documents-journal/${process.env.LEDGER_DEFAULT_COLLECTION}/${doc_id}`;

		const options = {
			method: 'GET',
			url: url,
		};

		const { data } = await axios(options);

		return data;
	} catch (e: any) {
		const message =
			(e?.response?.data?.errors && e?.response?.data?.errors[0]?.message) || e?.response?.data?.message || '';
		const log = e?.response?.data?.log || '';
		const statusCode = e?.response?.status;
		throw new BaseException(`${message} ${log}`, statusCode, e?.code);
	}
}

export default {
	docs,
};
