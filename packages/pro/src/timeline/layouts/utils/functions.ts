import { computed, Ref, unref } from 'vue';

export function addQueryToPath(path: string, query: Record<string, string>): string {
	const queryParams = new URLSearchParams(path.split('?')[1] || '');

	for (const [key, value] of Object.entries(query)) {
		queryParams.set(key, value);
	}

	return path.split('?')[0] + '?' + queryParams;
}

export function getRootPath(): string {
	const path = window.location.pathname;
	const parts = path.split('/');
	const adminIndex = parts.indexOf('admin');
	const rootPath = parts.slice(0, adminIndex).join('/') + '/';
	return rootPath;
}

export function getPublicURL(): string {
	const path = window.location.href;
	const parts = path.split('/');
	const adminIndex = parts.indexOf('admin');
	const rootPath = parts.slice(0, adminIndex).join('/') + '/';
	return rootPath;
}

export function syncRefProperty<R, T extends keyof R>(ref: Ref<R>, key: T, defaultValue: R[T] | Ref<R[T]>) {
	return computed<R[T]>({
		get() {
			return ref.value?.[key] ?? unref(defaultValue);
		},
		set(value: R[T]) {
			ref.value = Object.assign({}, ref.value, { [key]: value }) as R;
		},
	});
}
