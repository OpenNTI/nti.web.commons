import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {restProps} from '@nti/lib-commons';

import {StickyContainer} from '../../components';

import {LEFT, RIGHT} from './Constants';
import AsidePlaceholder from './AsidePlaceholder';
import Store from './Store';
import Styles from './Container.css';

const cx = classnames.bind(Styles);

export default
@Store.connect(['aside'])
class AsideContainer extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any,

		store: PropTypes.object,
		aside: PropTypes.shape({
			sticky: PropTypes.bool,
			side: PropTypes.oneOf([LEFT, RIGHT])
		})
	}


	render () {
		const {className, children, aside} = this.props;
		const otherProps = restProps(AsideContainer, this.props);
		const {side, sticky} = aside || {};
		const Cmp = sticky ? StickyContainer : 'div';

		return (
			<Cmp className={cx('container', className)} {...otherProps}>
				{side === LEFT && this.renderAside(aside)}
				<div className={cx('body')}>
					{children}
				</div>
				{side === RIGHT && this.renderAside(aside)}
			</Cmp>
		);
	}


	renderAside (aside) {
		if (!aside) { return null; }

		return (<AsidePlaceholder className={cx('aside-placeholder')} {...aside} />);
	}
}
