import React from 'react';
import PropTypes from 'prop-types';

import {Triggered} from '../../prompts';

import Single from './Single';
import Multiple from './Multiple';

ImageLightbox.propTypes = {
	trigger: PropTypes.any,
	children: PropTypes.any
};
export default function ImageLightbox ({trigger, children, ...otherProps}) {
	const Cmp = React.Children.count(children) > 1 ? Multiple : Single;

	return (
		<Triggered trigger={trigger}>
			<Cmp {...otherProps}>
				{children}
			</Cmp>
		</Triggered>
	);
}