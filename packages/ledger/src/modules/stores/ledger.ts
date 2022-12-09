import { defineStore } from 'pinia';
import { useApi } from '@directus/extensions-sdk';

export const useLedgerStore = defineStore({
	id: 'ledgerStore',
	state: () => ({
		connection: true,
		api: useApi(),
	}),
	actions: {
		async healthCheck() {
			try {
				const { data } = await this.api.get<any>(`/ledger/healthcheck`, {
					headers: { 'Cache-Control': 'no-cache' },
				});
				this.connection = data;
			} catch {
				this.connection = false;
			}
		},
	},
});
