<template>
	<div class="box">
		<div class="inline">
			<div class="title">
				<span>{{ subscription?.plan?.product?.name }}</span>
				<v-chip :class="{ chip: true, success: subscription.status === 'active' }" :small="true">
					{{ subscription.status.toUpperCase() }}
				</v-chip>
			</div>
			<v-button
				class="btn-portal"
				:small="true"
				:loading="isloading"
				v-tooltip="'View invoices, update payment methods, and billing information'"
				@click="goToPortal"
			>
				Go to Customer Portal
			</v-button>
		</div>
		<hr />
		<br />
		<div class="inline">
			<div>
				<div class="mb-10">Started</div>
				<strong>{{ startDate }}</strong>
			</div>

			<div v-if="upcomingInvoice" class="border-left pl-20 ml-20">
				<div class="mb-10">Next invoice</div>
				<strong>
					{{ `${symbols[subscription.plan.currency]}${upcomingInvoice.amount_due / 100}` }}
					on {{ endDate }}
				</strong>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	inject: ['api'],
	props: {
		subscription: {
			type: Object,
			required: true,
		},
		upcomingInvoice: {
			type: Object,
			default: () => null,
		},
	},
	data() {
		return {
			stripeUrl: null,
			isloading: false,
		};
	},
	computed: {
		symbols() {
			return {
				usd: '$',
				eur: '€',
			};
		},
		startDate() {
			const date = new Date(this.subscription.current_period_start * 1000);
			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			return date.toLocaleDateString('en-US', options);
		},
		endDate() {
			const date = new Date(this.subscription.current_period_end * 1000);
			const options = { year: 'numeric', month: 'long', day: 'numeric' };
			return date.toLocaleDateString('en-US', options);
		},
		amount() {
			return (this.subscription.quantity * this.subscription.plan.amount) / 100;
		},
		period() {
			const count = this.subscription.plan.interval_count;
			const interval = this.subscription.plan.interval;
			return count > 1 ? `per ${count} interval` : `per ${interval}`;
		},
	},
	methods: {
		goToPortal() {
			this.isloading = true;
			this.api.post('/billing/portal/sessions').then((res) => {
				this.isloading = false;
				window.location.href = res.data.url;
			});
		},
	},
};
</script>

<style scoped>
.padding-box {
	padding: var(--content-padding);
	padding-top: 0;
}
iframe {
	border: none;
	height: calc(100vh - 130px);
}
.box {
	padding: 10px;
}
p {
	margin-bottom: 8px;
}
.title {
	color: var(--v-divider-label-color);
	font-weight: 700;
	font-size: 24px;
}
hr {
	margin-top: 8px;
	border: solid;
	border-color: var(--v-divider-color);
	border-width: var(--border-width) 0 0 0;
}
.name {
	color: var(--foreground-normal-alt);
	font-weight: 600;
	font-size: 18px;
}
.price {
	font-size: 16px;
}
.chip {
	margin-left: 8px;
}
.chip.success {
	background-color: var(--green);
	color: white;
}
.inline {
	display: flex;
	align-items: center;
}
.inline .btn-portal {
	padding-left: 8px;
	margin-left: auto;
}
.border-left {
	border-left: 1px solid var(--v-divider-color);
}
.pl-20 {
	padding-left: 20px;
}
.ml-20 {
	margin-left: 20px;
}
.mb-10 {
	margin-bottom: 10px;
}
</style>
