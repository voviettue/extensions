<template>
	<v-input v-tooltip="info" :disabled="true" :model-value="expression" />

	<div style="margin: 8px 0px">
		<v-icon v-if="isActive && !!nextTime && !isExpired" v-tooltip="'Running'" name="play_circle" color="green" />
		<v-icon v-else v-tooltip="'Stopped'" name="play_disabled" color="red" />
		<span class="divider">|</span>
		<span style="color: gray; margin-left: 4px">
			<template v-if="!nextTime">Invalid expression</template>
			<template v-else>
				{{ isExpired ? 'Expired' : nextTime.toString() }}
			</template>
		</span>
	</div>

	<v-detail class="group-detail" :label="'View code'">
		<pre><code>{{ code }}</code></pre>
	</v-detail>
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
		code: {
			type: String,
			default: null,
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
