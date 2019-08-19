import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

export default {
	Base: {className: cx('nti-text')},
	Condensed: {className: cx('nti-text', 'condensed')}
};