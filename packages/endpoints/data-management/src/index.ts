import { defineEndpoint } from '@directus/extensions-sdk';
import busboy from 'busboy';
import { IncomingHttpHeaders } from 'http';
import csv from 'csv-parser';
import { queue } from 'async';
import { convertData } from './utils';
import destroyStream from 'destroy';

export default defineEndpoint(async (router, { services, exceptions, database, logger }) => {
	const { ItemsService, FieldsService, UsersService, MailService } = services;
	const { UnsupportedMediaTypeException, InvalidPayloadException } = exceptions;
	const formData = new Map();

	router.post('/import/:collection', async (req: any, res: any, next) => {
		if (req.is('multipart/form-data') === false) {
			throw new UnsupportedMediaTypeException(`Unsupported Content-Type header`);
		}

		let headers: IncomingHttpHeaders;
		if (req.headers['content-type']) {
			headers = req.headers as IncomingHttpHeaders;
		} else {
			headers = {
				...req.headers,
				'content-type': 'application/octet-stream',
			};
		}

		const bb = busboy({ headers });

		// Handle form data
		bb.on('field', (name, value) => {
			formData.set(name, value);
		});

		// Handle file uploads
		bb.on('file', async (_, file, { mimeType }) => {
			if (mimeType !== 'text/csv') {
				const err = new UnsupportedMediaTypeException(`Can't import files of type "${mimeType}"`);
				return next(err);
			}

			const usersService = new UsersService({ schema: req.schema, accountability: req.accountability });
			const mailService = new MailService({ schema: req.schema, accountability: req.accountability });

			let user = null;

			try {
				// Response immediately, don't let user wait for the import to finish
				res.status(200).end();

				user = await usersService.readOne(req.accountability.user, { fields: ['email'] });
				await importCSV(req.params.collection, req.accountability, req.schema, file);

				const collectionName = formData.get('collectionName') || req.params.collection;

				logger.info(`[IMPORT] ${collectionName} imported successfully`);

				if (user) {
					mailService.send({
						to: user.email,
						template: {
							name: 'base',
							data: {
								html: `${collectionName} has been imported successfully. Please <a href="${process.env.PUBLIC_URL}/admin/content/${req.params.collection}">click here</a> to access it.`,
							},
						},
						subject: `Your import has been successful`,
					});
				}
			} catch (err: any) {
				if (user) {
					mailService.send({
						to: user.email,
						template: {
							name: 'base',
							data: {
								html: `Error: ${err.message}`,
							},
						},
						subject: `Your import has been failed`,
					});
				}

				logger.error(`[IMPORT] ${err.message}`);
			}
		});

		bb.on('error', (err: Error) => next(err));

		req.pipe(bb);
	});

	function importCSV(collection: string, accountability: any, schema: any, stream: NodeJS.ReadableStream) {
		return database.transaction(async (trx) => {
			const fieldService = new FieldsService({ knex: trx, accountability, schema });

			const fields = await fieldService.readAll(collection);

			const service = new ItemsService(collection, {
				knex: trx,
				accountability: accountability,
				schema: schema,
			});

			const saveQueue = queue(async (value: Record<string, unknown>) => {
				return await service.upsertOne(value);
			});

			return new Promise<void>((resolve, reject) => {
				stream
					.pipe(csv())
					.on('data', (value: Record<string, string>) => {
						value = convertData(value, fields);
						saveQueue.push(value);
					})
					.on('error', (err) => {
						destroyStream(stream);
						reject(new InvalidPayloadException(err.message));
					})
					.on('end', () => {
						saveQueue.drain(() => {
							return resolve();
						});
					});

				saveQueue.error((err) => {
					reject(err);
				});
			});
		});
	}
});
