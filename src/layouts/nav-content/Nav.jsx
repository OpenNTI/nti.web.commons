import PropTypes from 'prop-types';
import cx from 'classnames';

import { StickyElement, FillToBottom } from '../../components';

Nav.propTypes = {
	className: PropTypes.string,
	sticky: PropTypes.bool,
	fill: PropTypes.bool,
	children: PropTypes.any,
};
export function Nav({ className, sticky, fill, children, ...otherProps }) {
	let content = children;

	if (fill) {
		content = <FillToBottom limit>{content}</FillToBottom>;
	}

	if (sticky) {
		content = <StickyElement topOffset={20}>{content}</StickyElement>;
	}

	return (
		<div
			className={cx('nav-content-nav', className)}
			{...otherProps}
			css={css`
				flex: 0 0 25%;
			`}
		>
			{content}
		</div>
	);
}
