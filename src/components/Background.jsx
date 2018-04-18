import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {addClass, removeClass} from '@nti/lib-dom';

const CONTEXT_KEY = 'content-background';

export default class extends React.Component {
	static displayName = 'Background';

	static propTypes = {
		className: PropTypes.any,
		imgUrl: PropTypes.string,
		children: PropTypes.any
	};

	static childContextTypes = { [CONTEXT_KEY]: PropTypes.string };
	static contextTypes = { [CONTEXT_KEY]: PropTypes.string };

	getChildContext () {
		return {
			[CONTEXT_KEY]: this.props.imgUrl || this.context[CONTEXT_KEY] || null
		};
	}

	getPreviousBackground = () => {
		return this.context[CONTEXT_KEY];
	};

	setBodyBackground = (url) => {
		const {body} = document;
		const {style} = body;

		const args = [body, 'content-background'];

		if (url) {
			addClass(...args);
		} else {
			removeClass(...args);
		}

		style.backgroundImage = url ? `url(${url})` : null;
	};

	componentDidMount () {
		const {props: {imgUrl}} = this;
		this.setBodyBackground(imgUrl);
	}

	componentWillReceiveProps (nextProps) {
		const {imgUrl} = nextProps;
		if (imgUrl !== this.props.imgUrl) {
			this.setBodyBackground(imgUrl);
		}
	}

	componentWillUnmount () {
		const prev = this.getPreviousBackground();
		this.setBodyBackground(prev);
	}

	render () {
		const {props: {className, imgUrl, children, ...props}} = this;
		return (
			<div {...props} className={cx('background-cmp', className, {'no-image': !imgUrl})}>
				{children}
			</div>
		);
	}
}
