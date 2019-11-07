import path from 'path';

export default function forSingleSourceDPI (src) {
	const ext = path.extname(src);
	const prefix = src.substr(0, src.length - ext.length);
	const dpi = (x) => `${prefix}@${x}${ext}`; 


	return [
		{src},
		{src: dpi('2x'), query: '2x'},
		{src: dpi('3x'), query: '3x'}
	];
}