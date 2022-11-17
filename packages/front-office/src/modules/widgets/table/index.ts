import { defineWidget } from '../../utils/define-extension';
import WidgetTableOptions from './components/table-options.vue';

export default defineWidget({
	id: 'table',
	name: 'Table',
	icon: 'table_view',
	options: WidgetTableOptions,
	beforeSave: (values) => {
		const columns = values.options?.columns || [];
		values.options.columns = columns.map((column: any) => {
			if (column?.display === 'image' && column?.displayOptions?.project_logo) {
				column.displayOptions.defaultImage = column.displayOptions.project_logo;
				delete column.displayOptions.project_logo;
			}
			return column;
		});
		return values;
	},
});
