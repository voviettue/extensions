import { defineHook } from '@directus/extensions-sdk';
import { RecurringSettings } from './types';
import { getItemsCount } from './utils';
import { addDays, addWeeks, addMonths, format } from 'date-fns';
import { queue } from 'async';

const RECURRING_COLLECTION = 'tasks';

export default defineHook(({ filter, action }, { logger, services }) => {
	const { ItemsService } = services;

	const createTasks = (parentId: number, payload: any, service: any) => {
		const saveQueue = queue(async (value: Record<string, unknown>) => {
			return await service.createOne(value);
		}, 2);

		const recurringSettings: RecurringSettings = {
			repeat: payload.repeat,
			frequency: payload.frequency,
			start: new Date(payload.start),
			until: new Date(payload.until),
		};

		const count = getItemsCount(recurringSettings);

		let date = recurringSettings.start;

		for (let i = 0; i < count; i++) {
			let nextDate = null;

			switch (recurringSettings.frequency) {
				case 'daily':
					nextDate = addDays(date, recurringSettings.repeat);
					break;
				case 'weekly':
					nextDate = addWeeks(date, recurringSettings.repeat);
					break;
				case 'monthly':
					nextDate = addMonths(date, recurringSettings.repeat);
					break;
			}

			date = nextDate;

			saveQueue.push({
				...payload,
				repeats: 'non_recurring',
				parent_id: parentId,
				repeats_every: null,
				time_period: null,
				start_date: null,
				end_date: null,
				due_date: date.toISOString(),
			});
		}

		saveQueue.drain(() => {
			logger.info(`[RECURRING]: All recurring tasks saved`);
		});

		saveQueue.error((err) => {
			logger.error(`[RECURRING]: Error saving recurring tasks`);
			logger.error(err);
		});
	};

	// Filter: DELETE
	filter(`${RECURRING_COLLECTION}.items.delete`, async (input: any, meta: any, ctx: any) => {
		ctx.database.transaction(async (trx: any) => {
			for (const id of input) {
				await trx.raw(`delete from ${RECURRING_COLLECTION} where parent_id = ?`, [id]);
			}
		});
	});

	// Filter: CREATE
	filter(`${RECURRING_COLLECTION}.items.create`, (input: any) => {
		if (input.repeats === 'non_recurring') {
			return input;
		}

		input.start_date = input.start_date || format(new Date(), 'yyyy-MM-dd');
		input.due_date = input.start_date;
		return input;
	});

	// Action: CREATE
	action(`${RECURRING_COLLECTION}.items.create`, async ({ payload, key }, ctx) => {
		if (payload.repeats === 'non_recurring') {
			return;
		}

		const service = new ItemsService(RECURRING_COLLECTION, {
			knex: ctx.database,
			accountability: ctx.accountability,
			schema: ctx.schema,
		});

		const taskPayload = {
			...payload,
			repeat: payload.repeats_every || 1,
			frequency: payload.time_period || 'daily',
			start: new Date(payload.start_date),
			until: new Date(payload.end_date),
		};

		createTasks(key, taskPayload, service);
	});

	// Filter: UPDATE
	filter(`${RECURRING_COLLECTION}.items.update`, (input: any) => {
		if ('start_date' in input) {
			input.due_date = input.start_date;
		}

		return input;
	});

	// Action: UPDATE
	action(`${RECURRING_COLLECTION}.items.update`, async ({ payload, keys }, ctx) => {
		const service = new ItemsService(RECURRING_COLLECTION, {
			knex: ctx.database,
			accountability: ctx.accountability,
			schema: ctx.schema,
		});

		// Filter recurring tasks
		const recurringTasks = [];
		for (const id of keys) {
			const item = await service.readOne(id);
			if (item.parent_id === null) {
				recurringTasks.push(item);
			}
		}

		for (const item of recurringTasks) {
			// Delete all tasks
			await ctx.database.raw(`delete from ${RECURRING_COLLECTION} where parent_id = ?`, [item.id]);

			if (item.repeats === 'non_recurring') {
				return;
			}

			// Create new tasks
			const parentId = item.id;
			delete item.id;
			delete item.generated_tasks;
			delete item.parent_id;

			// Get relational fields
			const taskPayload = {
				...item,
				...payload,
				repeat: payload.repeats_every || item.repeats_every,
				frequency: payload.time_period || item.time_period,
				start: new Date(payload.start_date || item.start_date),
				until: new Date(payload.end_date || item.end_date),
			};

			createTasks(parentId, taskPayload, service);
		}
	});
});
