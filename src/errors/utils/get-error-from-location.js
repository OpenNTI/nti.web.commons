export default function getErrorFromLocation (location = global.location) {
	const href = location?.href;

	if (!href) { return null; }

	const url = new URL(href);

	const error = url.searchParams.get('error');
	const failed = url.searchParams.get('failed');
	const message = url.searchParams.get('message');

	if (error) { return new Error(error); }
	if (failed && message) { return new Error(message); }
}