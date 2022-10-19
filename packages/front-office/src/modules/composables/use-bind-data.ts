import { useFrontOfficeStore } from '../stores/front-office';
import renderTemplate from '../utils/render-template';

export const useBindData = (template: string, localContext: Record<string, any> = {}) => {
	const store = useFrontOfficeStore();
	const context = store.context;

	return renderTemplate(template, { ...context, ...localContext });
};
