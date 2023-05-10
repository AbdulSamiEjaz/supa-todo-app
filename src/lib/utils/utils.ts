export function formatTime(dateString: Date) {
	const date = new Date(dateString);
	const formattedTime = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	}).format(date);
	return formattedTime;
}
