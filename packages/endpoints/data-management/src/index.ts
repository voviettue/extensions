import { defineEndpoint } from '@directus/extensions-sdk';
import busboy from 'busboy';
import { IncomingHttpHeaders } from 'http'
import csv from 'csv-parser'
import { queue } from 'async'
import { convertData } from './utils'
import destroyStream from 'destroy'

export default defineEndpoint(async (router, { services, exceptions, database }) => {
	const { ItemsService, FieldsService } = services
	const { UnsupportedMediaTypeException, InvalidPayloadException } = exceptions

	router.post('/import/:collection', async (req, res, next) => {
		if (req.is('multipart/form-data') === false) {
			throw new UnsupportedMediaTypeException(`Unsupported Content-Type header`);
		}

		let headers: IncomingHttpHeaders
		if (req.headers['content-type']) {
			headers = req.headers as IncomingHttpHeaders
		} else {
			headers = {
				...req.headers,
				'content-type': 'application/octet-stream',
			}
		}

		const bb = busboy({ headers })
		
		bb.on('file', async (_, file, { mimeType }) => {
			if (mimeType !== 'text/csv') {
				const err = new UnsupportedMediaTypeException(`Can't import files of type "${mimeType}"`)
				return next(err)
			}

			try {
				await importCSV(req.params.collection, req.accountability, req.schema, file)
			} catch(err: any) {
				return next(err)
			}

			return res.status(200).end();
		})

		bb.on('error', (err: Error) => next(err))

		req.pipe(bb)
	})

	function importCSV(collection: string, accountability: any, schema: any, stream: NodeJS.ReadableStream, ) {
		return database.transaction(async (trx) => {
			const fieldService = new FieldsService({
				accountability: accountability,
				schema: schema,
			})
			const fields = await fieldService.readAll(collection)

			const service = new ItemsService(collection, {
				knex: trx,
				accountability: accountability,
				schema: schema,
			})

			const saveQueue = queue(async (value: Record<string, unknown>) => {
				return await service.upsertOne(value)
			})

			return new Promise<void>((resolve, reject) => {
				stream.pipe(csv())
					.on('data', (value: Record<string,string>) => {
						value = convertData(value, fields)
						saveQueue.push(value)
					})
					.on('error', (err) => {
						destroyStream(stream)
						reject(new InvalidPayloadException(err.message))
					})
					.on('end', () => {
						saveQueue.drain(() => {
							return resolve()
						})
					})

				saveQueue.error(err => {
					reject(err)
				})
			})
		})
	}
});
