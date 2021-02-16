import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';

const RenderType = PropTypes.oneOfType([PropTypes.node, PropTypes.func]);

RenderTransitions.propTypes = {
	renders: PropTypes.shape({
		entering: RenderType,
		entered: RenderType,
		exiting: RenderType,
		exited: RenderType,
	}),
	show: PropTypes.bool,
	timeout: PropTypes.any,
};
export default function RenderTransitions({ renders, ...otherProps }) {
	return (
		<Transition {...otherProps}>
			{state => {
				const render = renders[state];

				if (typeof render === 'function') {
					return render({ state, ...otherProps });
				}

				return render || null;
			}}
		</Transition>
	);
}
