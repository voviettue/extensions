import { Field, DeepPartial } from '@directus/shared/types';
import { ComponentOptions } from 'vue';

export type ExtensionOptionsContext = {
	collection: string | undefined;
	values: Record<string, any>;
};

export type ExtensionOptions =
	| DeepPartial<Field>[]
	| ((ctx: ExtensionOptionsContext) => DeepPartial<Field>[])
	| ComponentOptions;

export interface MenuConfig {
	id: string;
	name: string;
	icon: string;
	options: ExtensionOptions;
}

export interface WidgetConfig {
	id: string;
	name: string;
	icon: string;
	group?: boolean;
	tabs?: boolean;
	options: ExtensionOptions;
	child_of?: string;
	beforeSave?: (values: Record<string, any>) => Record<string, any>;
	saved?: (widget: Record<string, any>) => void;
}

export interface QueryConfig {
	id: string;
	name: string;
	icon: string;
	options: ExtensionOptions;
	beforeSave?: (values: Record<string, any>) => Record<string, any>;
}

export interface DisplayConfig {
	id: string;
	name: string;
	icon: string;
	description: string;
	displayOptions: ExtensionOptions;
	types: string[];
}
