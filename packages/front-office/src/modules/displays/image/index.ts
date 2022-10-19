import { defineDisplay } from '../../utils/define-extension';
import image from '../../widgets/image';

export default defineDisplay({
	id: 'image',
	name: image.name,
	icon: image.icon,
	description: 'Display image',
	displayOptions: image.options,
	types: [],
});
