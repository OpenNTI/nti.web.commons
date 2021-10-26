import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';
import Dismiss from './Dismiss';
import Title from './Title';
import Pager from './Pager';
import Progress from './Progress';

const cx = classnames.bind(Styles);

const Controls = styled('div').attrs({ className: cx('controls') })``;

PagingHeader.propTypes = {
	onDismiss: PropTypes.func,

	title: PropTypes.string,
	subTitle: PropTypes.string,

	progress: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),

	controls: PropTypes.node,

	flat: PropTypes.bool,

	pager: PropTypes.shape({
		total: PropTypes.number,
		current: PropTypes.number,
		nextAnchor: PropTypes.node,
		previousAnchor: PropTypes.node,
	}),
};
export default function PagingHeader(props) {
	const { flat, controls } = props;

	return (
		<div className={cx('paging-window-header', { flat })}>
			<Dismiss {...props} />
			<Title {...props} />
			<Pager {...props} />
			{controls && <Controls>{controls}</Controls>}
			<Progress {...props} />
		</div>
	);
}
