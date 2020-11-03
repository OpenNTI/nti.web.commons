import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {restProps} from '@nti/lib-commons';

import {ClassList} from '../responsive';

import {LEFT, RIGHT} from './Constants';
import AsidePlaceholder from './AsidePlaceholder';
import Store from './Store';
import styles from './Container.css';

const classList = [
	{query: size => size.width >= 1024, className: cx('large')}
];

@Store.connect(['aside'])
class AsideContainer extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any,
		forwardedRef: PropTypes.any,
		asideClassName: PropTypes.string,

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
			<ClassList
				className={cx(styles.container, className)}
				classList={classList}
				{...otherProps}
			>
				{side === LEFT && this.renderAside(aside)}
				<section className={styles.body} ref={forwardedRef}>
					{children}
				</section>
				{side === RIGHT && this.renderAside(aside)}
			</ClassList>
		);
	}


	renderAside (aside) {
		if (!aside) { return null; }

		const {asideClassName} = this.props;

		return (<AsidePlaceholder className={cx(asideClassName, styles.asideContainer)} {...aside} />);
	}
}

const AsideContainerFwdRef = (props, ref) => <AsideContainer {...props} forwardedRef={ref} />;
export default React.forwardRef(AsideContainerFwdRef);

