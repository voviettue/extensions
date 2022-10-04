import { defineWidget } from '../../utils/define-extension';
import WidgetTableOptions from './components/table-options.vue';

export default defineWidget({
	id: 'table',
	name: 'Table',
	icon: 'table_view',
	options: WidgetTableOptions,
});
