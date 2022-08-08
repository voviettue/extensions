import { defineHook } from '@directus/extensions-sdk';
import cron from 'node-cron';

export default defineHook(({ action }, { services, database, getSchema, logger }) => {
	let hookFields: any = null;
	let schedules: any[] = [];

	const getHookFields = async () => {
		if (hookFields === null) {
			try {
				hookFields = await database.from('directus_fields').where('interface', '=', 'interface-schedule-email');
			} catch (err) {
				return [];
			}
		}

		return hookFields;
	};

	const destroyAllSchedule = () => {
		for (let schedule of schedules) {
			schedule.stop();
			schedule = null;
		}
		schedules = [];
	};

	async function init() {
		destroyAllSchedule();

		const fields = await getHookFields();
		for (const field of fields) {
			const options = JSON.parse(field.options) || {};

			if (!cron.validate(options?.expression) || !options?.emailTo) {
				return;
			}

			const expression = options?.expression;
			const schema = await getSchema();

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
					const MailService = services.MailService;
					const mailer = new MailService({ schema: schema });
					mailer.send({
						to: options.emailTo,
						cc: options?.emailCC || null,
						bcc: options?.emailBCC || null,
						subject: options?.emailSubject,
						html: options?.emailBody,
					});
				} catch (err) {
					logger.error(err);
				}
			});
			schedules.push(schedule);
		}
	}

	action('server.start', () => {
		init();
	});

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
