/* eslint-disable no-useless-catch */
import axios from 'axios';
import { defineHook } from '@directus/extensions-sdk';
import parseResponse from '../../modules/utils/parse-reponse';
import get from 'lodash/get';
import camelCase from 'lodash/camelCase';
import { Collection } from '../../modules/types';

export default defineHook(({ action }, { services, database, getSchema, exceptions }) => {
	const getService = async (collection: string) => {
		return new services.ItemsService(collection, {
			knex: database,
			schema: await getSchema(),
		});
	};

	const getLedgerCollectionByEvent = async (event: any) => {
		if (!event?.collection) return null;

		const ledgerCollectionService = await getService('cms_ledger_collections');
		let collection = await ledgerCollectionService.readByQuery({
			filter: {
				collection: { _eq: event?.collection },
			},
		});

		collection = collection?.map((e: any) => {
			return {
				...e,
				fields: JSON.parse(e.fields),
			};
		});

		return collection?.[0];
	};

	const getDocsByQuery = async (query: any) => {
		try {
			if (!query?.collection || !query?.item_id) {
				const { InvalidPayloadException } = exceptions;
				throw new InvalidPayloadException('missing collection or item_id');
			}

			const ledgerDocsService = await getService('cms_ledger_docs');
			const docs = await ledgerDocsService.readByQuery({
				filter: {
					collection: { _eq: query?.collection },
					item_id: { _eq: query?.item_id },
				},
			});

			return docs?.[0] ? docs[0].doc_id : null;
		} catch (e) {
			throw e;
		}
	};

	const getPayload = async (item_id: string, event: any, collection: Collection) => {
		try {
			const itemsService = await getService(collection.collection);

			const payload: Record<string, any> = {};
			const fields = collection.fields;
			const item = await itemsService.readOne(item_id, { fields });

			fields?.map((e: string) => (payload[camelCase(e)] = get(item, e) || ''));

			return payload;
		} catch (e) {
			throw e;
		}
	};

	// PUSH DATA TO DBQL ON AWS
	const createQLDBDoc = async (item_id: string, event: any, collection: Collection) => {
		try {
			const data = await getPayload(item_id, event, collection);
			const url = `${process.env.LEDGER_URL}/documents/${process.env.LEDGER_DEFAULT_COLLECTION}`;

			const response = await axios({ method: 'POST', url, data });
			const docId = response?.data?.data;
			await createLedgerDoc(docId, item_id, event.collection);
			return docId;
		} catch (e: any) {
			throw e;
		}
	};

	const updateOrCreateQLDBDoc = async (doc_id: string, item_id: string, event: any, collection: Collection) => {
		try {
			let doc;
			if (doc_id) {
				const data = await getPayload(item_id, event, collection);
				const url = `${process.env.LEDGER_URL}/documents/${process.env.LEDGER_DEFAULT_COLLECTION}/${doc_id}`;

				const response = await axios({ method: 'PATCH', url, data });
				doc = response?.data?.data;
			} else {
				doc = await createQLDBDoc(item_id, event, collection);
			}

			return doc;
		} catch (e: any) {
			throw e;
		}
	};

	const deleteQLDBDoc = async (doc_id: number) => {
		try {
			if (!doc_id) return;

			const url = `${process.env.LEDGER_URL}/documents/${process.env.LEDGER_DEFAULT_COLLECTION}/${doc_id}`;

			await axios({ method: 'DELETE', url });
		} catch (e: any) {
			throw e;
		}
	};

	// PUSH DATA TO TERMINAL DATABASE
	const createLedgerDoc = async (doc_id: string, item_id: number | string, collection: string) => {
		try {
			if (!doc_id) return;

			const ledgerDocsService = await getService('cms_ledger_docs');
			await ledgerDocsService.createOne({ item_id, doc_id, collection });
		} catch (e: any) {
			throw e;
		}
	};

	// HANDLER
	const handlerCRUD = async (event: any, item_id: string, collection: Collection) => {
		try {
			const doc_id = await getDocsByQuery({ item_id, collection: event?.collection });

			switch (event.event) {
				case 'items.create':
					await createQLDBDoc(item_id, event, collection);
					break;

				case 'items.update':
					await updateOrCreateQLDBDoc(doc_id, item_id, event, collection);
					break;

				case 'items.delete':
					await deleteQLDBDoc(doc_id);
					break;
				default:
					break;
			}
		} catch (e: any) {
			throw e;
		}
	};

	const handlerAction = async (event: any) => {
		try {
			const collection = await getLedgerCollectionByEvent(event);
			if (!collection) return;

			!!event.key && (event.keys = [event.key]);
			for (let i = 0; i < event.keys.length; i++) {
				await handlerCRUD(event, event.keys[i], collection);
			}
		} catch (e: any) {
			handlerError(e, event);
		}
	};

	const handlerError = async (e: any, event: any) => {
		const activityService = await getService('directus_activity');
		await activityService.createOne({
			action: event.event.split('.')[1],
			collection: 'QLDB',
			item: event.key || event.keys?.toString(),
			comment: parseResponse(e?.response),
		});
	};

	action('items.create', handlerAction);
	action('items.update', handlerAction);
	action('items.delete', handlerAction);
});
