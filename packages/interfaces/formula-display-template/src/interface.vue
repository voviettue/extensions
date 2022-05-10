<template>
  <div class="system-display-template">
    <v-notice v-if="collection === null" type="info">
      {{ t("interfaces.system-display-template.select_a_collection") }}
    </v-notice>

    <field-template
      v-else
      :collection="collection"
      :model-value="value"
      :disabled="disabled"
      @update:model-value="$emit('input', $event)"
    />
    <small class="note">Click + button to select a field or function</small>
  </div>
</template>

<script lang="ts">
import { useI18n } from "vue-i18n";
import { defineComponent, inject, ref, computed } from "vue";
import FieldTemplate from "./field-template.vue";

export default defineComponent({
  components: { FieldTemplate },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: null,
    },
    collectionField: {
      type: String,
      default: null,
    },
    collectionName: {
      type: String,
      default: null,
    },
  },
  emits: ["input"],
  setup(props) {
    const { t } = useI18n();
    const stores: any = inject("stores");
    const collectionsStore = stores.useCollectionsStore();

    const values = inject("values", ref<Record<string, any>>({}));

    const collection = computed(() => {
      if (!props.collectionField) {
        if (props.collectionName) return props.collectionName;
        return null;
      }

      const collectionName = values.value[props.collectionField];

      const collectionExists = !!collectionsStore.collections.find(
        (collection) => collection.collection === collectionName
      );
      if (collectionExists === false) return null;
      return collectionName;
    });

    return { t, collection };
  },
});
</script>

<style scoped>
.note {
  display: block;
  margin-top: 4px;
  color: var(--foreground-subdued);
  font-style: italic;
}
</style>