import PropTypes from 'prop-types';

import ImageContainer from '../image/Container';

import { Base } from './Base';
import { generator } from './generator';

const Outer = styled(ImageContainer)`
	position: relative;
	height: 0;
`;

const Inner = styled(Base)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

ImagePlaceholder.propTypes = {
	aspectRatio: PropTypes.number,
	flat: PropTypes.bool,
};
function ImagePlaceholder({ aspectRatio, flat, ...otherProps }) {
	return (
		<Outer {...otherProps} aspectRatio={aspectRatio}>
			<Inner flat={flat} />
		</Outer>
	);
}

export const Image = generator(ImagePlaceholder);
