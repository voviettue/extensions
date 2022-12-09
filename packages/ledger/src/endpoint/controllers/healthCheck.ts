import axios from 'axios';
import { ApiExtensionContext } from '@directus/shared/types';
import { BaseException } from '@directus/shared/exceptions';

async function healthCheck(req: any, res: any, ctx: ApiExtensionContext) {
	try {
		const url = `${process.env.LEDGER_URL}/healthcheck`;

		const { data } = await axios(`${process.env.LEDGER_URL}/healthcheck`);

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
	healthCheck,
};
