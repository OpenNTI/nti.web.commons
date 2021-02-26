import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const styles = stylesheet`
	.limit-lines {
		display: -webkit-box !important;
		-webkit-line-clamp: var(--line-limit);
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;

		/* The eventual standard:
		https://drafts.csswg.org/css-overflow-3/#propdef-line-clamp */
		line-clamp: var(--line-limit) "…";
	}
`;

const LimitLines = React.forwardRef(
	({ children, style, className, limitLines: limit, ...otherProps }, ref) => {
		const Text = React.Children.only(children);

		return React.cloneElement(Text, {
			...otherProps,
			ref,
			className: cx(className, styles.limitLines),
			style: {
				...style,
				'--line-limit': limit,
			},
		});
	}
);

LimitLines.displayName = 'LimitLines';
LimitLines.shouldApply = ({ limitLines }) => limitLines != null;

LimitLines.propTypes = {
	limitLines: PropTypes.number,
	style: PropTypes.object,
};

export default LimitLines;
