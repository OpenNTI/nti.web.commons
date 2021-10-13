import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { ResourceNotFound, FillToBottom } from '../../../components';

import Styles from './NotFound.css';

const cx = classnames.bind(Styles);

NotFoundPage.getBackAction = (...args) =>
	ResourceNotFound.getBackAction(...args);
NotFoundPage.propTypes = {
	className: PropTypes.string,
	fill: PropTypes.bool,
};
export default function NotFoundPage({ className, fill, ...otherProps }) {
	const content = <ResourceNotFound {...otherProps} />;
	const cls = cx('page-not-found');

	return fill ? (
		<FillToBottom as="section" className={cls}>
			{content}
		</FillToBottom>
	) : (
		<section className={cls}>{content}</section>
	);
}
