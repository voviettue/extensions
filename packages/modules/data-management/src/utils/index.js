export const convertArray = (value) => {
	if (!value) {
		return value
	}

	return value.split(",").map((e) => e.trim())
}

export const convertJson = (value) => {
	if (!value) {
		return value
	}

	try {
		return JSON.parse(value)
	}
	catch (err) {
		return value
	}
}

export const convertBoolean = (value) => {
	if (!value) {
		return value
	}

	if (["1", "TRUE", "YES", "Y", 'O'].includes(String(value).toUpperCase())) {
		return true
	}

	if (["0", "FALSE", "NO", "N", "X"].includes(String(value).toUpperCase())) {
		return false
	}

	return value
}

export const getDateFormatted = () => {
	const date = new Date();

	let month = String(date.getMonth() + 1);
	let day = String(date.getDate());
	let hours = String(date.getHours());
	let minutes = String(date.getMinutes());
	let seconds = String(date.getSeconds());

	return `${date.getFullYear()}-${month.padStart(2, '0')}-${day.padStart(2, '0')} at ${hours.padStart(2, '0')}.${minutes.padStart(2, '0')}.${seconds.padStart(2, '0')}`;
}
