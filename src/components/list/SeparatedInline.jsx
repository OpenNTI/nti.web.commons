import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

SeparatedInlineList.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string
};
export default function SeparatedInlineList ({children, className, ...otherProps}) {
	return (
		<ul className={cx('nti-separated-inline-list', className)}>
			{React.Children.map(children, (child, index) => {
				return (
					<li key={index}>
						{child}
					</li>
				);
			})}
		</ul>
	);
}
