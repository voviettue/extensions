<template>
	<v-input
		:placeholder="includeSeconds ? 'hh:mm:ss' : 'hh:mm'"
		:model-value="localValue"
		@update:model-value="onUpdate"
		@blur="onBlur"
	/>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		type: {
			type: String,
			default: 'text',
		},
		includeSeconds: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		const localValue = ref<string | null>(null);
		const cachedLocalValue = ref<string | null>(null);

		watch(
			() => props.value,
			async (newValue) => {
				if (newValue) {
					if (props.includeSeconds) {
						localValue.value = newValue;
					} else {
						const timeArr = newValue.split(':');
						localValue.value = `${timeArr[0]}:${timeArr[1]}`;
					}
				} else {
					localValue.value = null;
				}
			},
			{ immediate: true }
		);

		return { onBlur, onUpdate, localValue };

		function onBlur() {
			localValue.value = formatDuration(localValue.value);
			emit('input', localValue.value);
		}

		function onUpdate(newValue: string) {
			localValue.value = newValue;
		}

		function formatDuration(inputValue: string): string {
			let hourStr: string;
			let minStr: string;
			let secStr: string;

			let hours: number;
			let minutes: number;
			let seconds: number;

			switch (true) {
				// hh:mm:ss
				case /(\d+):(\d+):(\d+)/g.test(inputValue):
					[hourStr, minStr, secStr] = inputValue.match(/\d+/g);

					hours = parseInt(hourStr);
					minutes = parseInt(minStr);

					seconds = parseInt(secStr) % 60;
					minutes += (parseInt(secStr) / 60) >> 0;
					hours += (minutes / 60) >> 0;
					minutes = minutes % 60;
					break;

				// hh:mm
				case /(\d+):(\d+)/g.test(inputValue):
					[hourStr, minStr] = inputValue.match(/\d+/g);
					hours = parseInt(hourStr);
					minutes = parseInt(minStr);

					hours += (minutes / 60) >> 0;
					minutes = minutes % 60;
					break;

				// number
				case /^\d+$/g.test(inputValue):
					if (props.includeSeconds) {
						secStr = localValue.value;

						hours = Math.floor(parseInt(secStr) / 3600);
						minutes = Math.floor((parseInt(secStr) - (hours * 3600)) / 60);
						seconds = parseInt(secStr) - (hours * 3600) - (minutes * 60);
					} else {
						minStr = localValue.value;

						hours = Math.floor(parseInt(minStr) / 60);
						minutes = parseInt(minStr) % 60;
					}
					break;

				// decimal number
				case /^\d*\.?\d*$/.test(inputValue):
					if (props.includeSeconds) {
						minStr = localValue.value;

						hours = Math.floor(parseInt(minStr) / 60);
						minutes = Math.floor((parseInt(minStr) - (hours * 60)));
						seconds = Math.floor((parseFloat(minStr) - (hours * 60) - minutes) * 60);
					} else {
						hourStr = localValue.value;
						hours = Math.floor(parseInt(hourStr));
						minutes = Math.floor((parseFloat(hourStr) - hours) * 60);
					}
					break;

				default:
					return cachedLocalValue.value;
			}

			// Limit maximum hours
			if (hours > 838) {
				hours = 838;
				minutes = seconds = 59;
			}

			let resultStr = `${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;
			if (props.includeSeconds) {
				resultStr += `:${addLeadingZero(seconds ?? 0)}`;
			}
			cachedLocalValue.value = resultStr;

			return resultStr;
		}

		function addLeadingZero(number: any, size = 2): string {
			return number.toString().padStart(size, '0');
		}
	},
});
</script>
