import { useMediaQuery } from './use-media-query';

export default (maxCompactWidth = '736px') =>
	useMediaQuery(`(max-width: ${maxCompactWidth})`).matches
		? 'list-item'
		: 'card';
