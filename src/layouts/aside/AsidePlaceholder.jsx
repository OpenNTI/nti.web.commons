import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { decorate, rawContent } from '@nti/lib-commons';

import Store from './Store';
import styles from './AsidePlaceholder.css';

const DATA_ATTR = 'data-aside-content-container';
const placeholderTpl = `<div ${DATA_ATTR}></div>`;

class AsidePlaceholder extends React.Component {
	static propTypes = {
		className: PropTypes.string,

		setAsidePlaceholder: PropTypes.func,
	};

	attachPlaceholder = node => {
		const { setAsidePlaceholder } = this.props;

		if (!this.node && node) {
			this.node = node;
			setAsidePlaceholder(node.querySelector(`[${DATA_ATTR}]`));
		} else if (this.node && !node) {
			this.node = null;
			setAsidePlaceholder(null);
		}
	};

	render() {
		const { className } = this.props;

		return (
			<aside
				className={cx(styles.asidePlaceholder, className)}
				ref={this.attachPlaceholder}
				{...rawContent(placeholderTpl)}
			/>
		);
	}
}

export default decorate(AsidePlaceholder, [
	Store.monitor(['setAsidePlaceholder']),
]);
