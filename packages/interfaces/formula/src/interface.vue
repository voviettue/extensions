<template>
  <div>
    <v-input v-model="formattedValue" :disabled="disabled" :readonly="true">
      <template v-if="iconLeft" #prepend><v-icon :name="iconLeft" /></template>
      <template v-if="iconRight" #append><v-icon :name="iconRight" /></template>
    </v-input>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import get from "lodash/get";
import round from "lodash/round";
import functions from "./functions";

export default defineComponent({
  inject: ["values", "stores"],
  props: {
    collection: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: null,
    },
    template: {
      type: String,
      default: "",
    },
    thousandsSeparator: {
      type: String,
      default: "",
    },
    decimalSeparator: {
      type: String,
      default: "",
    },
    prefix: {
      type: String,
      default: "",
    },
    suffix: {
      type: String,
      default: "",
    },
    iconLeft: {
      type: String,
      default: null,
    },
    iconRight: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["input"],
  data() {
    return {
      formulaValue: this.value,
    };
  },
  computed: {
    fields() {
      const fieldsStore = this.stores.useFieldsStore();
      const fields = fieldsStore.getFieldsForCollection(this.collection);
      return fields;
    },
    currentField() {
      return this.fields.find((e) => e.field === this.field);
    },
    numberTypes() {
      return ["integer", "bigInteger", "decimal", "float"];
    },
    isNumberField() {
      return this.numberTypes.includes(this.currentField.type);
    },
    formattedValue() {
      let value = this.formulaValue;
      if (this.isNumberField) {
        value = this.formatNumber(this.formulaValue);
      }
      return `${this.prefix || ""}${value}${this.suffix || ""}`;
    },
  },
  watch: {
    values: {
      handler: function () {
        this.execute();
      },
      deep: true,
    },
  },
  mounted() {
    if (
      this.$attrs["primary-key"] === "+" ||
      !!this.$attrs["field-data"]?.meta?.group
    ) {
      this.execute();
    }
  },
  methods: {
    execute() {
      const statement = this.getStatement();
      this.formulaValue = this.getResult(statement);
      if (this.formulaValue !== this.value) {
        this.$emit("input", this.formulaValue);
      }
    },
    getStatement() {
      const regex = /({{.*?}})/g;
      return this.template
        .split(regex)
        .map((part: string) => {
          if (part.startsWith("{{") === false) return part;

          let fieldKey = part.replace(/{{/g, "").replace(/}}/g, "").trim();
          return `PROP('${fieldKey}')`;
        })
        .join("");
    },
    getResult(statement) {
      try {
        const {
          CONCATENATE,
          TRIM,
          LOWER,
          UPPER,
          LEN,
          AND,
          IF,
          OR,
          ABS,
          COUNT,
          AVERAGE,
          MAX,
          MIN,
          SUM,
          VALUE,
          DATEADD,
          DATETIME_DIFF,
          SECOND,
          MINUTE,
          HOUR,
          DAY,
          MONTH,
          YEAR,
          NOW,
          WORKDAY_DIFF,
        } = functions;
        const fn = new Function(
          "PROP",
          Object.keys(functions).join(","),
          `return ${statement}`
        );
        const PROP = (fieldKey) => {
          return this.getValue(fieldKey);
        };
        let result = fn(
          PROP,
          CONCATENATE,
          TRIM,
          LOWER,
          UPPER,
          LEN,
          AND,
          IF,
          OR,
          ABS,
          COUNT,
          AVERAGE,
          MAX,
          MIN,
          SUM,
          VALUE,
          DATEADD,
          DATETIME_DIFF,
          SECOND,
          MINUTE,
          HOUR,
          DAY,
          MONTH,
          YEAR,
          NOW,
          WORKDAY_DIFF
        );

        if (result === NaN || result === Infinity) {
          return "";
        }

        return this.cast(result);
      } catch (err) {
        return "#ERROR";
      }
    },
    getValue(fieldKey: any) {
      const field = this.fields.find((e) => e.field === fieldKey);
      const isNumberField = this.numberTypes.includes(field.type);
      const defaultNullValue = isNumberField ? 0 : "";
      const value = get(
        this.values.value,
        field.field,
        field?.schema?.default_value || defaultNullValue
      );

      return value;
    },
    cast(value) {
      const schema = this.currentField.schema;

      if (typeof value === "boolean") {
        value = value ? 1 : 0;
      }

      switch (schema.type) {
        case "decimal":
        case "float":
          return round(value, schema.numeric_scale);

        case "integer":
        case "bigInteger":
          return round(value);

        default:
          return value;
      }
    },
    formatNumber(number) {
      var str = String(number).split(".");

      str[0] = str[0] || "";
      var left = [];
      for (var i = str[0].length; i > 0; i -= 3) {
        left.unshift(str[0].substring(Math.max(0, i - 3), i));
      }
      str[0] = left.join(this.thousandsSeparator);

      return str.join(this.decimalSeparator || ".");
    },
  },
});
</script>
