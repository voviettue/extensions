export type LookupMap = {
	field: string;
	relationField: string;
	lookupCollection: string;
	lookupCollectionPK: string;
	lookupField: string;
	triggerOnCreate: boolean;
	triggerOnUpdate: boolean;
	manualUpdate: boolean;
};
