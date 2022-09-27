import { defineWidget } from '../../utils/define-extension';
import WidgetTableOptions from '../../components/widgets/table/widget-table-options.vue';

export default defineWidget({
	id: 'table',
	name: 'Table',
	icon: 'table_view',
	options: WidgetTableOptions,
	extendOptions: [
		{
			field: 'data',
			name: 'Data',
			meta: {
				interface: 'input-multiline',
				width: 'full',
			},
		},
		{
			field: 'onRowClick',
			name: 'On Row Click (Javascript)',
			meta: {
				width: 'full',
				interface: 'input-javascript',
				options: {
					context: { $item: {} },
					minLine: 4,
				},
				note: 'Type "/" to see all of variables and function are supported.',
			},
		},
		{
			field: 'strippedRow',
			name: 'Stripped row',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
		},
		{
			field: 'border',
			name: 'Border',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-color',
			},
		},
		{
			field: 'verticalLines',
			name: 'Vertical Lines',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
			},
		},
		{
			field: 'height',
			name: 'Height',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Input value',
				},
			},
		},
		{
			field: 'textAlign',
			name: 'Text Align',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Left',
							value: 'left',
						},
						{
							text: 'Right',
							value: 'right',
						},
						{
							text: 'Center',
							value: 'center',
						},
						{
							text: 'Justify',
							value: 'justify',
						},
					],
					placeholder: 'Select',
					allowNone: true,
				},
			},
		},
		{
			field: 'textSize',
			name: 'Text Size',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'XS - 0.75rem',
							value: '0.75rem',
						},
						{
							text: 'SM - 0.875rem',
							value: '0.875rem',
						},
						{
							text: 'LG - 1.125rem',
							value: '1.125rem',
						},
						{
							text: 'XL - 1.25rem',
							value: '1.25rem',
						},
						{
							text: '2XL - 1.5rem',
							value: '1.5rem',
						},
						{
							text: '3XL - 1.875rem',
							value: '1.875rem',
						},
					],
					placeholder: 'Select',
					allowNone: true,
				},
			},
		},
		{
			field: 'textStyle',
			name: 'Text Style',
			type: 'json',
			meta: {
				interface: 'select-multiple-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Bold',
							value: 'bold',
						},
						{
							text: 'Italic',
							value: 'italic',
						},
						{
							text: 'Underline',
							value: 'underline',
						},
					],
					placeholder: 'Select',
					allowNone: true,
				},
			},
		},
		{
			field: 'borderRadius',
			name: 'Border Radius',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Input value',
				},
			},
		},
		{
			field: 'verticalAlignment',
			name: 'Vertical Alignment',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'Top',
							value: 'top',
						},
						{
							text: 'Middle',
							value: 'middle',
						},
						{
							text: 'Bottom',
							value: 'bottom',
						},
					],
					placeholder: 'Select',
					allowNone: true,
				},
			},
		},
		{
			field: 'shadow',
			name: 'Box Shadow',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{
							text: 'SM',
							value: 'sm',
						},
						{
							text: 'MD',
							value: 'md',
						},
						{
							text: 'LG',
							value: 'lg',
						},
						{
							text: 'XL',
							value: 'xl',
						},
						{
							text: '2XL',
							value: '2xl',
						},
					],
					placeholder: 'Select',
					allowNone: true,
				},
			},
		},
		{
			field: 'pagination',
			name: 'Pagination',
			type: 'boolean',
			meta: {
				interface: 'radio',
				width: 'half',
			},
		},
	],
});
