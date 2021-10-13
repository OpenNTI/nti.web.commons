import PropTypes from 'prop-types';
import cx from 'classnames';

const Icon = styled('i')`
	display: inline-block;
`;

FontIcon.propTypes = {
	className: PropTypes.string,
	icon: PropTypes.string,
};
export default function FontIcon({ className, icon, ...otherProps }) {
	return <Icon className={cx('font-icon', 'nt-icon', className, icon)} {...otherProps} />;
}
