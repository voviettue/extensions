<template>
	<v-input v-tooltip="info" :disabled="true" :model-value="expression" />

	<div style="margin-top: 8px">
		<v-icon v-if="isActive && !!nextTime && !isExpired" v-tooltip="'Running'" name="play_circle" color="green" />
		<v-icon v-else v-tooltip="'Stopped'" name="play_disabled" color="red" />
		<span class="divider">|</span>
		<v-icon v-tooltip="'View email template'" :clickable="true" name="remove_red_eye" @click="showModal = true" />
		<span class="divider">|</span>
		<span style="color: gray; margin-left: 4px">
			<template v-if="!nextTime">Invalid expression</template>
			<template v-else>
				{{ isExpired ? 'Expired' : nextTime.toString() }}
			</template>
		</span>
	</div>

	<v-drawer :title="'Email template'" :model-value="showModal" icon="link" @cancel="showModal = false">
		<div class="drawer-content">
			<label>Send to</label>
			<div>
				<v-chip v-for="email in emailTo" :key="`to-${email}`" class="chip">
					{{ email }}
				</v-chip>
			</div>
			<br />

			<template v-if="emailCC.length">
				<label>CC</label>
				<div>
					<v-chip v-for="email in emailCC" :key="`cc-${email}`" class="chip">
						{{ email }}
					</v-chip>
				</div>
				<br />
			</template>

			<template v-if="emailBCC.length">
				<label>BCC</label>
				<div>
					<v-chip v-for="email in emailBCC" :key="`cc-${email}`" class="chip">
						{{ email }}
					</v-chip>
				</div>
				<br />
			</template>

			<label>Subject</label>
			<v-input :readonly="true" :model-value="emailSubject" />
			<br />
			<label>Body</label>
			<div class="body">
				<div v-html="emailBody"></div>
			</div>
		</div>
	</v-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import parser from 'cron-parser';
import cronstrue from 'cronstrue';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		expression: {
			type: String,
			default: '',
		},
		emailTo: {
			type: Array,
			default: () => [],
		},
		emailCC: {
			type: Array,
			default: () => [],
		},
		emailBCC: {
			type: Array,
			default: () => [],
		},
		emailSubject: {
			type: String,
			default: '',
		},
		emailBody: {
			type: String,
			default: '',
		},
		startDate: {
			type: String,
			default: null,
		},
		endDate: {
			type: String,
			default: null,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			nextTime: null,
			error: null,
			info: '',
			showModal: false,
		};
	},
	computed: {
		isExpired() {
			if (!this.endDate || !this.nextTime) {
				return false;
			}

			return new Date(this.nextTime.toISOString().slice(0, 10)) > new Date(this.endDate);
		},
	},
	created() {
		try {
			this.info = cronstrue.toString(this.expression);
			const interval = parser.parseExpression(this.expression, {
				utc: true,
			});
			this.nextTime = this.getNextTime(interval);
		} catch (err) {
			this.error = err;
		}
	},
	methods: {
		getNextTime(interval) {
			const nextTime = interval.next();

			if (!nextTime) {
				return null;
			}

			if (this.startDate && nextTime < new Date(this.startDate)) {
				return this.getNextTime(interval);
			}

			return nextTime;
		},
	},
});
</script>

<style scoped>
.chip {
	margin: 0 8px 4px 0;
}
.body {
	padding: 16px;
	background: whitesmoke;
	min-height: 300px;
	border-radius: 6px;
}
.divider {
	margin: 0 4px;
	color: lightgray;
}
.drawer-content {
	padding: var(--content-padding);
	padding-bottom: var(--content-padding-bottom);
}
</style>
