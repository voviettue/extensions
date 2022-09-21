import { defineDisplay } from '../../utils/define-extension';
import button from '../../widgets/button';

export default defineDisplay({
	id: 'button',
	name: 'Button',
	icon: 'smart_button',
	description: 'Display button',
	displayOptions: button.options,
	types: ['string'],
});
