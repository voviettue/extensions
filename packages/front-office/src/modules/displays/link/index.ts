import { defineDisplay } from '../../utils/define-extension';
import link from '../../widgets/link';

export default defineDisplay({
	id: 'link',
	name: 'Link',
	icon: 'link',
	description: 'Display url',
	displayOptions: link.options,
	types: ['string'],
});
