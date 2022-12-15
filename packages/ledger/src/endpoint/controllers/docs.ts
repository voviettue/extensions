import axios from 'axios';
import { ApiExtensionContext } from '@directus/shared/types';
import { BaseException } from '@directus/shared/exceptions';

async function docs(req: any, res: any, ctx: ApiExtensionContext) {
	const doc_id = req.params?.id;
	try {
		const { InvalidPayloadException } = ctx.exceptions;
		const { ItemsService } = ctx.services;

		const itemsService = new ItemsService('cms_ledger_docs', {
			schema: req.schema,
			accountability: req.accountability,
		});

		const document = await itemsService.readOne(doc_id, { fields: '*' });

		if (!document) {
			throw new InvalidPayloadException('Item Not Found');
		}

		const url = `${process.env.LEDGER_URL}/v1/documents-journal/${document.collection}/${document.doc_id}`;

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
