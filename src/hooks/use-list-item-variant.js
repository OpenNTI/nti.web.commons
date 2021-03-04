import { useMediaQuery } from './use-media-query';

export const useListItemVariant = (
	propVariant = 'auto',
	maxCompactWidth = '736px'
) => {
	const variant = useMediaQuery(`(max-width: ${maxCompactWidth})`).matches
		? 'list-item'
		: 'card';

	return propVariant === 'auto' ? variant : propVariant;
};
