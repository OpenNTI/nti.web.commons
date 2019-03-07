import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';

import {StickyElement, FillToBottom} from '../../components';

import Store from './Store';

const placeholderTpl = '<div data-aside-placeholder></div>';

export default
@Store.monitor(['setAsidePlaceholder'])
class AsidePlaceholder extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		sticky: PropTypes.bool,
		fill: PropTypes.bool,

		setAsidePlaceholder: PropTypes.func
	}

	attachPlaceholder = (node) => {
		const {setAsidePlaceholder} = this.props;

		if (!this.node && node) {
			this.node = node;
			setAsidePlaceholder(node.querySelector('[data-aside-placeholder]'));
		} else if (this.node && !node) {
			this.node = null;
			setAsidePlaceholder(null);
		}
	}


	render () {
		const {className, sticky, fill} = this.props;

		let content = (
			<div ref={this.attachPlaceholder} {...rawContent(placeholderTpl)} />
		);

		if (fill) {
			content = (<FillToBottom limit>{content}</FillToBottom>);
		}

		if (sticky) {
			content = (<StickyElement topOffset={20}>{content}</StickyElement>);
		}

		return (
			<div className={className}>
				{content}
			</div>
		);
	}
}
