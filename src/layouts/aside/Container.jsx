import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {restProps} from '@nti/lib-commons';

import {LEFT, RIGHT} from './Constants';
import AsidePlaceholder from './AsidePlaceholder';
import Store from './Store';
import Styles from './Container.css';

const cx = classnames.bind(Styles);

@Store.connect(['aside'])
class AsideContainer extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any,
		forwardedRef: PropTypes.any,

		store: PropTypes.object,
		aside: PropTypes.shape({
			side: PropTypes.oneOf([LEFT, RIGHT])
		})
	}


	render () {
		const {className, children, aside, forwardedRef} = this.props;
		const otherProps = restProps(AsideContainer, this.props);
		const {side} = aside || {};

		return (
			<div className={cx('container', className)} ref={forwardedRef} {...otherProps}>
				{side === LEFT && this.renderAside(aside)}
				<section className={cx('body')}>
					{children}
				</section>
				{side === RIGHT && this.renderAside(aside)}
			</div>
		);
	}


	renderAside (aside) {
		if (!aside) { return null; }

		return (<AsidePlaceholder className={cx('aside-container')} {...aside} />);
	}
}

const AsideContainerFwdRef = (props, ref) => <AsideContainer {...props} forwardedRef={ref} />;
export default React.forwardRef(AsideContainerFwdRef);

