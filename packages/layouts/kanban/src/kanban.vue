<template>
	<div class="layout-kanban" :class="{ loading }">
		<draggable
			v-for="(group, index) in groupItems"
			class="group"
			:list="group"
			:group="collection"
			:item-key="index"
			:key="index"
			@change="onChange(index, $event)"
		>
			<template #header>
				<div class="header">
					<div class="title">
						<div class="title-content">{{ t(groupByText(index)) ?? groupByText(index) }}</div>
						<span class="badge">{{ group?.length ?? '0' }}</span>
					</div>
				</div>
			</template>

			<template #item="{ element }">
				<router-link :to="`/content/${collection}/${element.id}`" class="item">
					<div v-if="cardTitle" class="title">
						<render-template :collection="collection" :item="element" :template="cardTitle" />
					</div>
					<img
						v-if="element[cardImage]"
						class="image"
						:src="imageSrc(element[cardImage])"
						:style="cardImageFit ? 'max-height: 150px; object-fit: cover;' : 'max-height: none;'"
						role="presentation"
					/>
					<div v-if="cardSubtitle" class="subtitle">
						<render-template :collection="collection" :item="element" :template="cardSubtitle" />
					</div>
					<div v-if="element[cardTags]" class="display-labels">
						<v-chip
							v-for="tag in element[cardTags]" :key="tag"
							small label disabled
						>{{ tag }}</v-chip>
					</div>
					<div class="addition">
						<span class="datetime">{{ formattedTime(element[cardDate]) }}</span>
						<div class="avatar">
							<v-avatar x-small v-tooltip="userName(element[cardUser])">
								<img
									v-if="avatarSrc(element[cardUser])"
									:src="avatarSrc(element[cardUser])"
									:alt="userName(element[cardUser])"
								/>
								<v-icon v-else name="person_outline" />
							</v-avatar>
						</div>
					</div>
				</router-link>
			</template>
		</draggable>
		<v-dialog :model-value="onChangeError !== null">
			<v-card>
				<v-card-title>{{ t('unexpected_error_copy') }}</v-card-title>
				<v-card-text>
					<v-error :error="onChangeError" />
				</v-card-text>
				<v-card-actions>
					<v-button secondary @click="onChangeError = null">OK</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-info v-if="error" type="danger" :title="t('unexpected_error')" icon="error" center>
			{{ t('unexpected_error_copy') }}

			<template #append>
				<v-error :error="error" />

				<v-button small class="reset-preset" @click="resetPresetAndRefresh">
					{{ t('reset_page_preferences') }}
				</v-button>
			</template>
		</v-info>

		<v-info v-if="!groupBy" type="warning" icon="layers" center>
			Configure the Group By option first
		</v-info>
	</div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { useApi, useStores } from '@directus/extensions-sdk';
import { defineComponent, PropType, computed, ref, watchEffect } from 'vue';
import { Item } from '@directus/shared/types';
import draggable from 'vuedraggable';
import { format } from 'date-fns';
import { addQueryToPath } from './utils/add-query-to-path';
import { getRootPath } from './utils/get-root-path';
import { getFieldsFromTemplate } from '@directus/shared/utils';

export default defineComponent({
	inheritAttrs: false,
	components: { draggable },
	props: {
		collection: {
			type: String,
			required: true,
		},
		items: {
			type: Array as PropType<Item[]>,
			required: true,
		},
		loading: {
			type: Boolean,
			required: true,
		},
		error: {
			type: Object as PropType<any>,
			default: null,
		},
		resetPresetAndRefresh: {
			type: Function as PropType<() => Promise<void>>,
			required: true,
		},
		groupBy: {
			type: String,
			default: null,
		},
		groupTitle: {
			type: String,
			default: null,
		},
		cardTitle: {
			type: String,
			default: null,
		},
		cardSubtitle: {
			type: String,
			default: null,
		},
		cardTags: {
			type: String,
			default: null,
		},
		cardDate: {
			type: String,
			default: null,
		},
		cardImage: {
			type: String,
			default: null,
		},
		cardImageFit: {
			type: Boolean,
			default: true,
		},
		cardUser: {
			type: String,
			default: null,
		},
		showUngrouped: {
			type: Boolean,
			default: false,
		},
		onCardClick: {
			type: Function as PropType<(item: Item) => void>,
			required: true,
		},
		getItems: {
			type: Function as PropType<() => Promise<void>>,
			required: true,
		},
	},
	setup(props, { emit }) {
		const { t } = useI18n();
		const api = useApi();

		const { useFieldsStore } = useStores();
		const fieldsStore = useFieldsStore();

		const computedGroupedItems = computed(() => {
			try {
				const groupByField = fieldsStore.getField(props.collection, props.groupBy);

				if (groupByField?.meta?.options?.choices) {
					let result = {};
					const choiceValues = groupByField?.meta?.options?.choices?.map((choice: any) => choice.value);

					const ungroupedItems = props.items?.filter(
						(item: any) => !item[props.groupBy] || !choiceValues.includes(item[props.groupBy])
					);
					if (ungroupedItems && props.showUngrouped) {
						result['ungrouped'] = ungroupedItems;
					}

					groupByField?.meta?.options?.choices?.forEach((option: any) => {
						result[option.value] = props.items?.filter((item: any) => option.value == item[props.groupBy]);
					})

					return result;
				} else {
					return {};
				}
			} catch (err) {
				return {};
			}
		});

		const groupItems = ref(computedGroupedItems.value);
		watchEffect(() => groupItems.value = computedGroupedItems.value);

		const onChangeError = ref(null);

		return {
			t,
			groupItems,
			groupByText,
			formattedTime,
			imageSrc,
			avatarSrc,
			userName,
			onChange,
			onChangeError,
			getFieldsFromTemplate,
		};

		async function onChange(index: any, event: any) {
			if (event?.added) {
				const itemId = event.added?.element?.id;
				const targetGroupName = index;
				return await updateGroupBy(itemId, targetGroupName == 'ungrouped' ? null : targetGroupName);
			}
		}

		async function updateGroupBy(itemId: string | number, targetGroupName: any) {
			return await api.patch(
				`items/${props.collection}/${itemId}`,
				{ [props.groupBy]: targetGroupName }
			).catch(async (err: any) => {
				onChangeError.value = err;
				await props.getItems();
			})
		}

		function groupByText(value: string | number): string {
			const groupByField = fieldsStore.getField(props.collection, props.groupBy);

			return groupByField?.meta?.options?.choices?.
				find((option: any) => option.value == value)?.text?.replace('$t:', '') ?? 'Ungrouped';
		}

		function formattedTime(time: any) {
			if (time) {
				// timestamp is in iso-8601
				return format(new Date(time), String(`${t('date-fns_date_short')} ${t('date-fns_time_short')}`));
			}
		};

		function imageSrc(image: any): string | null {
			if (image?.id) {
				return addTokenToURL(`${getRootPath()}assets/${image.id}`);
			}
		}

		function avatarSrc(user: any): string | null {
			if (user?.avatar?.id) {
				return addTokenToURL(`${getRootPath()}assets/${user.avatar.id}?key=system-medium-cover`);
			}
		}

		function userName(user: any): string | null {
			if (user?.first_name && user?.last_name) {
				return `${user.first_name} ${user.last_name}`;
			}

			if (user?.first_name) {
				return user.first_name;
			}

			if (user?.email) {
				return user.email;
			}
		}

		function getToken(): string | null {
			return api.defaults.headers.common['Authorization']?.split(' ')[1] || null;
		}

		function addTokenToURL(url: string, token?: string): string {
			const accessToken = token || getToken();
			if (!accessToken) return url;

			return addQueryToPath(url, { access_token: accessToken });
		}
	},
});
</script>
<style lang="scss" scoped>
.loading {
	opacity: 0.25;
}

.layout-kanban {
	display: flex;
	min-height: calc(100% - 65px - 48px);
	padding: 0px 32px 24px 32px;
	overflow-x: auto;
	overflow-y: hidden;
	--user-spacing: 16px;

	.group {
		display: flex;
		flex-direction: column;
		padding: 8px 0;
		// background-color: var(--background-normal);
		background-color: #f7fafc;
		border: var(--border-width) solid var(--border-normal);
		border-radius: var(--border-radius);
		margin-right: 20px;
		transition: border-color var(--transition) var(--fast);
		min-width: 350px;

		.header {
			display: flex;
			justify-content: space-between;
			margin: 0 16px 8px 16px;
			font-weight: 700;

			.title {
				max-width: calc(100% - 60px);
				display: flex;

				.title-content {
					width: auto;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: var(--foreground-normal-alt);
					margin-right: 6px;
				}

				.badge {
					display: inline-flex;
					justify-content: center;
					padding: 0px 6px;
					height: 20px;
					min-width: 20px;
					margin-top: 2px;
					text-align: center;
					font-size: 12px;
					line-height: 20px;
					background-color: var(--background-normal-alt);
					border-radius: 12px;
				}
			}
		}

		.item {
			width: 320px;
			display: block;
			margin: 2px 16px 6px 16px;
			padding: 12px 16px;
			background-color: var(--background-page);
			border-radius: var(--border-radius);
			box-shadow: 0px 2px 4px 0px rgba(var(--card-shadow-color), 0.1);

			.render-template {
				white-space: break-spaces;
			}

			.title {
				color: var(--primary);
				transition: color var(--transition) var(--fast);
				font-weight: 700;
				line-height: 1.25;
				margin-bottom: 4px;
			}

			.image {
				width: 100%;
				margin-top: 10px;
				border-radius: var(--border-radius);
			}

			.subtitle {
				font-size: 14px;
				line-height: 1.4em;
				-webkit-line-clamp: 4;
				-webkit-box-orient: vertical;
				overflow: hidden;
				display: -webkit-box;
			}

			.display-labels {
				display: flex;
				flex-wrap: wrap;
				margin-top: 6px;

				.v-chip {
					border: none;
					background-color: var(--background-normal);
					font-size: 12px;
					font-weight: 600;
					margin-top: 4px;
					margin-right: 4px;
					height: 20px;
					padding: 0 6px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}

			.addition {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 8px;
				margin-bottom: 2px;

				.datetime {
					display: inline-block;
					color: var(--foreground-subdued);
					font-size: 13px;
					font-weight: 600;
					line-height: 24px;
				}

				.avatar {
					padding-left: var(--user-spacing);
					display: flex;
					flex-direction: row-reverse;
				}
			}

			&:hover {
				.title {
					text-decoration: underline;
				}
			}
		}
	}

	.reset-preset {
		margin-top: 24px;
	}
}
</style>
