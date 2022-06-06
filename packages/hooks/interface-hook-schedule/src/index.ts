import { defineHook } from '@directus/extensions-sdk';
import cron from 'node-cron';

export default defineHook(({ action }, { services, exceptions, database, getSchema, env, logger, emitter }) => {
	let hookFields: any = null;
	let schedules: any[] = [];

	const getHookFields = async () => {
		if (hookFields === null) {
			try {
				hookFields = await database.from('directus_fields').where('interface', '=', 'interface-hook-schedule');
			} catch (err) {
				return [];
			}
		}
		return hookFields;
	};

	const destroyAllSchedule = () => {
		schedules.forEach((schedule) => {
			schedule.stop();
			schedule = null;
		});
		schedules = [];
	};

	const pushErrorNotification = async (field: any, err: any) => {
		const schema = await getSchema();
		const NotificationsService = services.NotificationsService;
		const service = new NotificationsService({ schema });
		const activity: any = await database
			.from('directus_activity')
			.where('action', '=', 'create')
			.andWhere('collection', '=', 'directus_fields')
			.andWhere('item', '=', field.id)
			.first();

		if (!activity) return;

		service.createOne({
			recipient: activity.user,
			sender: activity.user,
			subject: `Error from hook schedule`,
			message: err.message,
		});
	};

	async function init() {
		destroyAllSchedule();

		const fields = await getHookFields();
		fields.forEach(async (field: any) => {
			const options = JSON.parse(field.options) || {};

			if (!cron.validate(options?.expression)) {
				return;
			}

			const expression = options?.expression;
			const schedule = cron.schedule(expression, async () => {
				const now = new Date();
				const today = new Date(now.toISOString().slice(0, 10));

				if (!options?.isActive) {
					return;
				}

				if (options?.startDate && today < new Date(options.startDate)) {
					return;
				}

				if (options?.endDate && today > new Date(options.endDate)) {
					return;
				}

				try {
					const fn = new Function(
						'services',
						'exceptions',
						'database',
						'getSchema',
						'env',
						'logger',
						'emitter',
						options.code
					);
					fn(services, exceptions, database, getSchema, env, logger, emitter);
				} catch (err) {
					pushErrorNotification(field, err);
					logger.error(err);
				}
			});
			schedules.push(schedule);
		});
	}

	init();

	// clear cache
	action('fields.create', () => {
		hookFields = null;
		init();
	});

	action('fields.update', () => {
		hookFields = null;
		init();
	});

	action('fields.delete', () => {
		hookFields = null;
		init();
	});
});
