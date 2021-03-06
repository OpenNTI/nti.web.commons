import add from './add-class';

export default className =>
	typeof document !== 'undefined'
		? add(document.body.parentNode, className)
		: () => void 0;
