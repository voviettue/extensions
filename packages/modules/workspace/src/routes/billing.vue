<template>
  <private-view title="Billing">
    <template #headline>
      <v-breadcrumb :items="[{ name: 'Workspace Info', to: '/workspace/' }]" />
    </template>

    <template #title-outer:prepend>
      <v-button class="header-icon" rounded disabled icon secondary>
        <v-icon name="credit_card" />
      </v-button>
    </template>

    <template #navigation>
      <navigation></navigation>
    </template>

    <div class="padding-box" v-if="fetched">
      <template v-if="subscription">
        <billing-detail
          :subscription="subscription"
          :upcomingInvoice="upcomingInvoice"
        ></billing-detail>
      </template>
      <template v-else> There is no data to show </template>
    </div>
  </private-view>
</template>

<script>
import Navigation from "../components/navigation.vue";
import BillingDetail from "../components/billing-detail.vue";
import formatTitle from "@directus/format-title";

export default {
  components: { BillingDetail, Navigation },
  inject: ["api"],
  setup() {
    return {
      formatTitle,
    };
  },
  data() {
    return {
      fetched: false,
      subscription: null,
      upcomingInvoice: null,
    };
  },
  created() {
    this.api.get("/billing/subscription").then((res) => {
      this.fetched = true;
      this.subscription = res?.data?.data;
      this.upcomingInvoice = res?.data?.meta?.upcomingInvoice;
    });
  },
};
</script>

<style scoped>
.padding-box {
  padding: var(--content-padding);
  padding-top: 0;
}
</style>
