import { defineDisplay } from '../../utils/define-extension';
import menuButton from '../../widgets/menu-button';

export default defineDisplay({
	id: 'menu-button',
	name: 'Menu Button',
	icon: 'arrow_drop_down_circle',
	description: 'Display menu button',
	displayOptions: menuButton.options,
	types: [],
});
