<template>
	<span>{{ displayValue }}</span>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		format: {
			type: String,
			default: 'hh:mm:ss',
		},
		type: {
			type: String,
			default: 'text',
		},
	},
	setup(props) {
		const displayValue = ref<string | null>(null);
		const localValue = computed(() => {
			return props.value;
		});

		watch(
			localValue,
			async (newValue) => {
				switch (props.type) {
					case 'time':
						displayValue.value = displayTimeDuration(newValue);
						break;

					case 'integer':
					case 'bigInteger':
						displayValue.value = displayNumberDuration(newValue);
						break;
				}
			},
			{ immediate: true }
		);

		return { displayValue };

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

		function addLeadingZero(number: any = 0, size = 2): string {
			return number.toString().padStart(size, '0');
		}
	},
});
</script>
