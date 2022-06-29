import { Collection as CollectionRaw, CollectionType } from '@directus/shared/types';

export interface Collection extends CollectionRaw {
	name: string;
	icon: string;
	type: CollectionType;
	color?: string | null;
}

export type Item = {
	create: Record<string, any>[];
	update: Record<string, any>[];
	delete: (string | number)[];
};
