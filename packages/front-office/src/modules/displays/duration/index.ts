import { defineDisplay } from '../../utils/define-extension';

export default defineDisplay({
	id: 'duration',
	name: 'Duration',
	icon: 'timer',
	description: 'Display duration',
	displayOptions: [
		{
			field: 'format',
			name: 'Format',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				required: true,
				width: 'half',
				options: {
					choices: [
						{
							text: 'hh:mm:ss',
							value: 'hh:mm:ss',
						},
						{
							text: 'hh:mm',
							value: 'hh:mm',
						},
						{
							text: 'mm:ss',
							value: 'mm:ss',
						},
					],
					allowOther: false,
				},
			},
		},
		{
			field: 'type',
			name: 'Type',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				required: true,
				width: 'half',
				options: {
					choices: [
						{
							text: 'Time',
							value: 'time',
						},
						{
							text: 'Integer',
							value: 'integer',
						},
						{
							text: 'Big Integer',
							value: 'bigInteger',
						},
					],
					allowOther: false,
				},
			},
		},
	],
	types: ['time', 'integer', 'bigInteger'],
});
