<template>
  <span>{{ formattedValue }}</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    value: {
      type: String,
      default: null,
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
  },
  computed: {
    formattedValue() {
      var str = String(this.value).split(".");

      str[0] = str[0] || "";
      var left = [];
      for (var i = str[0].length; i > 0; i -= 3) {
        left.unshift(str[0].substring(Math.max(0, i - 3), i));
      }
      str[0] = left.join(this.thousandsSeparator || "");

      const number = str.join(this.decimalSeparator || ".");

      return `${this.prefix || ""}${number}${this.suffix || ""}`;
    },
  },
});
</script>
