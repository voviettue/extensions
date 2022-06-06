const daysInWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'saturday'];
const numberTypes = ['integer', '"bigInteger"', 'decimal', 'float'];

const parseDate = (date: any) => {
	const d = date instanceof Date ? date : new Date(date);

	if (!(d instanceof Date) || isNaN(d.getTime())) {
		throw Error('Invalid date value');
	}

	return d;
};

const parseTime = (value: any) => {
	const regex = /^([0-9]+):([0-5]?[0-9]):([0-5]?[0-9])$/;
	const regexNoHour = /^([0-5]?[0-9]):([0-5]?[0-9])$/;

	// valid time
	if (String(value).match(regex) || String(value).match(regexNoHour)) {
		return value.split(':').length < 3 ? `${value}:00` : value;
	}

	// invalid number
	if (Number(value) === NaN) return null;

	// valid number
	const seconds = Math.abs(parseInt(value)) || null;
	if (!seconds) return null;
	const hh = Math.floor(seconds / 3600);
	const mm = Math.floor((seconds - hh * 3600) / 60);
	const ss = seconds - hh * 3600 - mm * 60;
	return (
		`${String(hh).padStart(2, '0')}` + ':' + `${String(mm).padStart(2, '0')}` + ':' + `${String(ss).padStart(2, '0')}`
	);
};

const getExpressionFieldKeys = (template: string) => {
	const regex = /({{.*?}})/g;
	const keys: any = [];
	template.split(regex).forEach((part: string) => {
		if (part.startsWith('{{') === false) return;

		let fieldKey = part.replace(/{{/g, '').replace(/}}/g, '').trim();
		keys.push(fieldKey);
	});
	return keys;
};

export { daysInWeek, numberTypes, parseDate, parseTime, getExpressionFieldKeys };
