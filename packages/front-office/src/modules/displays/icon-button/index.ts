import { defineDisplay } from '../../utils/define-extension';
import iconButton from '../../widgets/icon-button';

export default defineDisplay({
	id: 'icon-button',
	name: 'Icon Button',
	icon: 'add_box',
	description: 'Display icon button',
	displayOptions: iconButton.options,
	types: ['string'],
});
