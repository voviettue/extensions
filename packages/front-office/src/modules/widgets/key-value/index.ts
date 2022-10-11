import { defineWidget } from '../../utils/define-extension';
import formFieldsDisplay from './config/form-fields-display';

export default defineWidget({
	id: 'keyValue',
	name: 'Key Value',
	icon: 'list_alt',
	options: [
		{
			field: 'data',
			name: 'Data',
			meta: {
				required: true,
				interface: 'input-multiline',
				width: 'full',
			},
		},
		{
			field: 'keys',
			name: 'Keys',
			type: 'json',
			meta: {
				interface: 'list-key-display',
				options: {
					formFields: formFieldsDisplay,
				},
			},
		},
		{
			field: 'rows',
			name: 'Rows',
			type: 'number',
			meta: {
				interface: 'input',
				width: 'half',
				options: {
					trim: true,
					placeholder: 'Maximum of number items per page',
				},
			},
		},
		{
			field: 'background',
			name: 'Background',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'style',
			name: 'Style',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'Default',
							value: null,
						},
						{
							text: 'Bottom line',
							value: 'bottom-line',
						},
						{
							text: 'Connected line',
							value: 'connected-line',
						},
						{
							text: 'Covered border',
							value: 'covered-border',
						},
					],
				},
			},
		},
		{
			field: 'borderType',
			name: 'Border type',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'Default',
							value: null,
						},
						{
							text: 'Solid',
							value: 'solid',
						},
						{
							text: 'Dashed',
							value: 'dashed',
						},
						{
							text: 'Dotted',
							value: 'dotted',
						},
					],
				},
			},
		},
		{
			field: 'textAlignLeft',
			name: 'Text Align Left',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'Default',
							value: null,
						},
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
				},
			},
		},
		{
			field: 'textAlignRight',
			name: 'Text Align Right',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					allowNone: true,
					choices: [
						{
							text: 'Default',
							value: null,
						},
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
				},
			},
		},
		{
			field: 'textStyleLeft',
			name: 'Text Style Left',
			type: 'json',
			meta: {
				interface: 'select-multiple-dropdown',
				width: 'half',
				options: {
					placeholder: 'Select styles',
					allowNone: true,
					choices: [
						{
							text: 'BOLD',
							value: 'bold',
						},
						{
							text: 'ITALIC',
							value: 'italic',
						},
						{
							text: 'UNDERLINE',
							value: 'underline',
						},
					],
				},
			},
		},
		{
			field: 'textStyleRight',
			name: 'Text Style Right',
			type: 'json',
			meta: {
				interface: 'select-multiple-dropdown',
				width: 'half',
				options: {
					placeholder: 'Select styles',
					allowNone: true,
					choices: [
						{
							text: 'BOLD',
							value: 'bold',
						},
						{
							text: 'ITALIC',
							value: 'italic',
						},
						{
							text: 'UNDERLINE',
							value: 'underline',
						},
					],
				},
			},
		},
		{
			field: 'textColorLeft',
			name: 'Text Color Left',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
		{
			field: 'textColorRight',
			name: 'Text Color Right',
			type: 'string',
			meta: {
				interface: 'select-color',
				width: 'half',
			},
		},
	],
});
