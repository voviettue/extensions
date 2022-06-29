<template>
	<v-input :placeholder="format" :model-value="localValue" :class="font" @update:model-value="onUpdate" @blur="onBlur">
		<template v-if="iconLeft" #prepend><v-icon :name="iconLeft" /></template>
		<template v-if="iconRight" #append><v-icon :name="iconRight" /></template>
	</v-input>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
	props: {
		value: {
			type: [String, Number],
			default: null,
		},
		type: {
			type: String,
			default: 'text',
		},
		format: {
			type: String,
			default: 'hh:mm:ss',
		},
		iconLeft: {
			type: String,
			default: null,
		},
		iconRight: {
			type: String,
			default: null,
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		const localValue = ref<string | null>(null);
		const cachedLocalValue = ref<{ hours: number; minutes: number; seconds: number }>(null);

		watch(
			() => props.value,
			async (newValue) => {
				switch (props.type) {
					case 'time':
						localValue.value = displayTimeDuration(newValue.toString());
						break;

					case 'integer':
					case 'bigInteger':
						localValue.value = displayNumberDuration(newValue.toString());
						break;
				}
			},
			{ immediate: true }
		);

		return { onBlur, onUpdate, localValue };

		function displayTimeDuration(val: string) {
			if (val === null) return;

			const timeArr = val.split(':');
			switch (props.format) {
				case 'hh:mm:ss':
					return `${timeArr[0]}:${timeArr[1]}:${timeArr[2]}`;
				case 'hh:mm':
					return `${timeArr[0]}:${timeArr[1]}`;
				case 'mm:ss':
					return `${timeArr[1]}:${timeArr[2]}`;
			}
		}

		function displayNumberDuration(val: string) {
			if (val === null) return;

			const hours = Math.floor(parseInt(val) / (3600 * 1000));
			const minutes = Math.floor((parseInt(val) / 1000 - hours * 3600) / 60);
			const seconds = parseInt(val) / 1000 - hours * 3600 - minutes * 60;

			switch (props.format) {
				case 'hh:mm:ss':
					return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
				case 'hh:mm':
					return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;
				case 'mm:ss':
					return `${addLeadingZero((hours ?? 0) * 60 + minutes)}:${addLeadingZero(seconds)}`;
			}
		}

		function onBlur() {
			const { hours, minutes, seconds } = destructDuration(localValue.value) || {};

			// console.log(hours, minutes, seconds, props.type, props.format,
			// 	formatString(hours, minutes, seconds),
			// 	parseDuration(hours, minutes, seconds)
			// );

			localValue.value = displayTimeDuration(formatString(hours, minutes, seconds));
			emit('input', parseDuration(hours, minutes, seconds));
		}

		function onUpdate(newValue: string) {
			localValue.value = newValue;
		}

		function formatString(hours: number, minutes: number, seconds: number) {
			if (!hours && !minutes && !seconds) return;

			let hourStr = addLeadingZero(hours);
			let minStr = addLeadingZero(minutes);
			let secStr = addLeadingZero(seconds);

			switch (props.format) {
				case 'hh:mm:ss':
					return `${hourStr}:${minStr}:${secStr}`;
				case 'hh:mm':
					return `${hourStr}:${minStr}:00`;
				case 'mm:ss':
					minStr = addLeadingZero((hours ?? 0) * 60 + minutes);
					return `00:${minStr}:${secStr}`;
			}
		}

		function parseDuration(hours: number, minutes: number, seconds: number) {
			if (!hours && !minutes && !seconds) return;

			switch (props.type) {
				case 'time':
					return formatString(hours, minutes, seconds);
				case 'integer':
				case 'bigInteger':
					return ((hours ?? 0) * 60 * 60 + (minutes ?? 0) * 60 + (seconds ?? 0)) * 1000;
			}
		}

		function destructDuration(inputValue: string): { hours: number; minutes: number; seconds: number } {
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
					switch (props.format) {
						case 'hh:mm':
							[hourStr, minStr] = inputValue.match(/\d+/g);
							hours = parseInt(hourStr);
							minutes = parseInt(minStr);

							hours += (minutes / 60) >> 0;
							minutes = minutes % 60;
							seconds = 0;
							break;
						case 'mm:ss':
							[minStr, secStr] = inputValue.match(/\d+/g);
							minutes = parseInt(minStr);
							seconds = parseInt(secStr);

							hours = 0;
							minutes += (seconds / 60) >> 0;
							seconds = seconds % 60;
							break;
					}
					break;

				// number
				case /^\d+$/g.test(inputValue):
					switch (props.format) {
						case 'hh:mm:ss':
							secStr = inputValue;

							hours = Math.floor(parseInt(secStr) / 3600);
							minutes = Math.floor((parseInt(secStr) - hours * 3600) / 60);
							seconds = parseInt(secStr) - hours * 3600 - minutes * 60;
							break;
						case 'hh:mm':
							minStr = inputValue;

							hours = Math.floor(parseInt(minStr) / 60);
							minutes = parseInt(minStr) % 60;
							seconds = 0;
							break;
						case 'mm:ss':
							secStr = inputValue;

							hours = 0;
							minutes = Math.floor(parseInt(secStr) / 60);
							seconds = parseInt(secStr) % 60;
							break;
					}
					break;

				// decimal number
				case /^\d*\.?\d*$/.test(inputValue):
					switch (props.format) {
						case 'hh:mm:ss':
							minStr = inputValue;

							hours = Math.floor(parseInt(minStr) / 60);
							minutes = Math.floor(parseInt(minStr) - hours * 60);
							seconds = Math.floor((parseFloat(minStr) - hours * 60 - minutes) * 60);
							break;
						case 'hh:mm':
							hourStr = inputValue;

							hours = Math.floor(parseInt(hourStr));
							minutes = Math.floor((parseFloat(hourStr) - hours) * 60);
							seconds = 0;
							break;
						case 'mm:ss':
							minStr = inputValue;

							hours = 0;
							minutes = Math.floor(parseInt(minStr));
							seconds = Math.floor((parseFloat(minStr) - minutes) * 60);
							break;
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

			cachedLocalValue.value = { hours, minutes, seconds };
			return { hours, minutes, seconds };
		}

		function addLeadingZero(number: any = 0, size = 2): string {
			return number.toString().padStart(size, '0');
		}
	},
});
</script>
