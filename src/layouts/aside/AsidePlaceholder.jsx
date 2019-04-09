import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {rawContent} from '@nti/lib-commons';

import Styles from './AsidePlaceholder.css';
import Store from './Store';

const cx = classnames.bind(Styles);

const DATA_ATTR = 'data-aside-content-container';
const placeholderTpl = `<div ${DATA_ATTR}></div>`;

export default
@Store.monitor(['setAsidePlaceholder'])
class AsidePlaceholder extends React.Component {
	static propTypes = {
		className: PropTypes.string,

		setAsidePlaceholder: PropTypes.func
	}

	attachPlaceholder = (node) => {
		const {setAsidePlaceholder} = this.props;

		if (!this.node && node) {
			this.node = node;
			setAsidePlaceholder(node.querySelector(`[${DATA_ATTR}]`));
		} else if (this.node && !node) {
			this.node = null;
			setAsidePlaceholder(null);
		}
	}

	render () {
		const {className} = this.props;

		return (
			<aside
				className={cx('aside-placeholder', className)}
				ref={this.attachPlaceholder}
				{...rawContent(placeholderTpl)}
			/>
		);
	}
}
