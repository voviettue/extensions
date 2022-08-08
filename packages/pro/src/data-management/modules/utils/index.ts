export const getDateFormatted = () => {
	const date = new Date();

	const month = String(date.getMonth() + 1);
	const day = String(date.getDate());
	const hours = String(date.getHours());
	const minutes = String(date.getMinutes());
	const seconds = String(date.getSeconds());

	return `${date.getFullYear()}-${month.padStart(2, '0')}-${day.padStart(2, '0')} at ${hours.padStart(
		2,
		'0'
	)}.${minutes.padStart(2, '0')}.${seconds.padStart(2, '0')}`;
};
