<script lang="ts">
import { defineComponent, inject, watch } from 'vue';
import { useRoute } from 'vue-router';
import get from 'lodash/get';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		triggerOnCreate: {
			type: Boolean,
			default: () => true,
		},
		triggerOnUpdate: {
			type: Boolean,
			default: () => false,
		},
		code: {
			type: String,
			default: null,
		},
	},
	emits: ['apply', 'setFieldValue'],
	setup(props, { emit }) {
		const values: any = inject('values');
		const stores: any = inject('stores');
		const api = inject('api');
		const route = useRoute();

		const primaryKey = route.params?.primaryKey;
		const isEdit = primaryKey !== '+' ? true : false;

		const { useUserStore } = stores;
		const userStore = useUserStore();
		const currentUser = userStore.currentUser;
		let setValueCount = 0;
		let isExecuted = false;
		if (isEdit) {
			if (Object.keys(values.value).length) {
				execute();
			}

			watch(
				() => values.value,
				() => {
					if (isExecuted) return;
					execute();
				}
			);
		} else {
			execute();
		}

		function setValue(key: string, value: any) {
			setValueCount += 1;
			setTimeout(() => {
				emit('setFieldValue', { field: key, value });
			}, setValueCount);
		}

		function getValue(key: string) {
			return get(values.value, key);
		}

		function execute() {
			isExecuted = true;
			if (!props.code) return;
			if (!isEdit && !props.triggerOnCreate) return;
			if (isEdit && !props.triggerOnUpdate) return;

			try {
				const fn = new Function('setValue', 'getValue', 'api', 'stores', 'currentUser', props.code);
				fn(setValue, getValue, api, stores, currentUser);
			} catch (err) {
				// eslint-disable-next-line
				console.log('[EmbedCode] Error', { err });
				// do nothing
			}
		}
	},
});
</script>
