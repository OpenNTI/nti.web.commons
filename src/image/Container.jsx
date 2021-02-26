import PropTypes from 'prop-types';

import { getStylesForAspectRatio } from './utils';

const Container = styled('div').attrs(({ aspectRatio, style, ...props }) => ({
	...props,
	style: {
		...style,
		...(!aspectRatio
			? null
			: {
					paddingBottom: getStylesForAspectRatio(aspectRatio)
						.paddingBottom,
			  }),
	},
}))`
	position: relative;
	height: 0;
	overflow: hidden;

	& img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
`;

Container.propTypes = {
	aspectRatio: PropTypes.number,
};
export default Container;
