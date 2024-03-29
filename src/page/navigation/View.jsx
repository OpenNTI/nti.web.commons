import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from '../Styles.css';

import Outline from './outline';

const cx = classnames.bind(Styles);

PageNavigation.Outline = Outline;
PageNavigation.isNavigation = child => child.type === PageNavigation;
PageNavigation.propTypes = {
	className: PropTypes.string,
	as: PropTypes.any,
	children: PropTypes.any,
	card: PropTypes.bool,
	sticky: PropTypes.bool,
};
export default function PageNavigation({
	className,
	as: tag,
	children,
	card = true,
	sticky = true,
}) {
	const Cmp = tag || 'nav';

	return (
		<Cmp className={cx('nt-page-navigation', className, { card, sticky })}>
			{children}
		</Cmp>
	);
}
