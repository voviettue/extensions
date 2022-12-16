import axios from 'axios';
import { ApiExtensionContext } from '@directus/shared/types';
import { BaseException } from '@directus/shared/exceptions';

async function create(req: any, res: any, ctx: ApiExtensionContext) {
	const collection = req.body.collection;
	try {
		const { InvalidPayloadException } = ctx.exceptions;
		const { ItemsService } = ctx.services;

		if (!collection) {
			throw new InvalidPayloadException('missing collection');
		}

		const itemsService = new ItemsService('cms_ledger_collections', {
			schema: req.schema,
			accountability: req.accountability,
		});

		const allCollection = await itemsService.readByQuery({ fields: '*' });
		const allCollectionActive = allCollection.filter((e: any) => e.active) || [];

		if (allCollection.find((e: any) => e.collection === collection)) {
			throw new BaseException(`Field collection has to be unique.`, 400, 'RECORD_NOT_UNIQUE', {
				code: 'RECORD_NOT_UNIQUE',
				collection: 'collection',
				field: null,
				invalid: 'cms_ledger_collections',
			});
		}

		if (allCollectionActive.length >= process.env.LEDGER_LIMIT_COLLECTION) {
			throw new InvalidPayloadException(
				`QLDB: The maximum collection active is ${process.env.LEDGER_LIMIT_COLLECTION}`
			);
		}

		const url = `${process.env.LEDGER_URL}/v1/collections`;
		const body = { collection };
		const options = {
			method: 'POST',
			url: url,
			data: body,
		};

		const response = await axios(options);
		const hash = response.data.data;

		const id = await itemsService.createOne({ ...req.body, hash });

		return id;
	} catch (e: any) {
		const message =
			(e?.response?.data?.errors && e?.response?.data?.errors[0]?.message) ||
			e?.response?.data?.message ||
			e?.message ||
			'';
		const log = e?.response?.data?.log || '';
		const statusCode = e?.response?.status || e?.status;
		throw new BaseException(`${message} ${log}`, statusCode, e?.code, e?.extensions);
	}
}

async function deleteMany(req: any, res: any, ctx: ApiExtensionContext) {
	try {
		const { ItemsService } = ctx.services;

		const itemsService = new ItemsService('cms_ledger_collections', {
			schema: req.schema,
			accountability: req.accountability,
		});

		const collections = await itemsService.readMany(req.body, { fields: '*' });

		for (let i = 0; i < collections.length; i++) {
			const url = `${process.env.LEDGER_URL}/v1/collections/${collections[i].collection}`;
			try {
				await axios.delete(url);
				await itemsService.updateOne(collections[i].id, { active: false });
			} catch (error: any) {
				const errorKey = error?.response?.data?.error_key;
				if (errorKey === 'QLDB_CAN_NOT_DELETE_ERROR') {
					await itemsService.updateOne(collections[i].id, { active: false });
				} else {
					const message =
						(error?.response?.data?.errors && error?.response?.data?.errors[0]?.message) ||
						error?.response?.data?.message ||
						'';
					const log = error?.response?.data?.log || '';
					const statusCode = error?.response?.status;
					throw new BaseException(`${message} ${log}`, statusCode, error?.code);
				}
			}
		}

		return true;
	} catch (error: any) {
		throw new BaseException(error?.message, error?.statusCode, error?.code);
	}
}

async function deleteOne(req: any, res: any, ctx: ApiExtensionContext) {
	try {
		const collectionId = req.params?.id;
		const { ItemsService } = ctx.services;

		const itemsService = new ItemsService('cms_ledger_collections', {
			schema: req.schema,
			accountability: req.accountability,
		});

		const collection = await itemsService.readOne(collectionId, { fields: '*' });

		try {
			const url = `${process.env.LEDGER_URL}/v1/collections/${collection.collection}`;
			await axios.delete(url);
			await itemsService.updateOne(collection.id, { active: false });
		} catch (error: any) {
			const errorKey = error?.response?.data?.error_key;
			if (errorKey === 'QLDB_CAN_NOT_DELETE_ERROR') {
				await itemsService.updateOne(collection.id, { active: false });
			} else {
				const message =
					(error?.response?.data?.errors && error?.response?.data?.errors[0]?.message) ||
					error?.response?.data?.message ||
					'';
				const log = error?.response?.data?.log || '';
				const statusCode = error?.response?.status;
				throw new BaseException(`${message} ${log}`, statusCode, error?.code);
			}
		}

		return true;
	} catch (error: any) {
		throw new BaseException(error?.message, error?.statusCode, error?.code);
	}
}

async function unDeleteByHash(req: any, res: any, ctx: ApiExtensionContext) {
	try {
		const hash = req.params?.hash;
		const { ItemsService } = ctx.services;
		const { InvalidPayloadException } = ctx.exceptions;

		const itemsService = new ItemsService('cms_ledger_collections', {
			schema: req.schema,
			accountability: req.accountability,
		});

		const allCollection = await itemsService.readByQuery({ fields: '*' });
		const allCollectionActive = allCollection.filter((e: any) => e.active) || [];
		const collection = allCollection.find((e: any) => e.hash === hash);
		const id = collection?.id;

		if (allCollectionActive.length >= process.env.LEDGER_LIMIT_COLLECTION) {
			throw new InvalidPayloadException(
				`QLDB: The maximum collection active is ${process.env.LEDGER_LIMIT_COLLECTION}`
			);
		}

		if (!id) {
			throw new InvalidPayloadException('Item Not Found');
		}

		try {
			const url = `${process.env.LEDGER_URL}/v1/collections/undelete-by-hash/${hash}`;
			await axios.post(url);
			await itemsService.updateOne(id, { active: true });
		} catch (error: any) {
			const log = error?.response?.data?.log;
			if (log?.includes('api error 412')) {
				await itemsService.updateOne(id, { active: true });
			} else {
				const message =
					(error?.response?.data?.errors && error?.response?.data?.errors[0]?.message) || error?.response?.data || '';
				const log = error?.response?.data?.log || '';
				const statusCode = error?.response?.status;
				throw new BaseException(`${message} ${log}`, statusCode, error?.code);
			}
		}
	} catch (error: any) {
		throw new BaseException(error?.message, error?.statusCode, error?.code);
	}
}

export default {
	create,
	deleteMany,
	deleteOne,
	unDeleteByHash,
};
