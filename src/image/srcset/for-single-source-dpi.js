import path from 'path';

function getDPIGenerator (src) {
	const url = new URL(src, global.location.origin);

	const ext = path.extname(url.pathname);
	const prefix = url.pathname.substr(0, url.pathname.length - ext.length);

	return (x) => {
		const dpi = new URL(url);

		dpi.pathname = `${prefix}@${x}${ext}`;

		return dpi.toString();
	};
}

export default function forSingleSourceDPI (src) {
	const dpi = getDPIGenerator(src);

	return [
		{src},
		{src: dpi('2x'), query: '2x'},
		{src: dpi('3x'), query: '3x'}
	];
}
