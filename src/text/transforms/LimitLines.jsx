import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {ForwardRef} from '../../decorators';
import {getStyles} from '../utils';

import Styles from './LimitLines.css';

const cx = classnames.bind(Styles);

//TODO: recompute ellipse after a resize or size change

export default
@ForwardRef('textRef')
class LimitLines extends React.Component {
	static shouldApply ({limitLines}) { return limitLines != null; }

	static propTypes = {
		className: PropTypes.string,
		limitLines: PropTypes.number,
		style: PropTypes.object,
		textRef: PropTypes.func,
		children: PropTypes.any
	}

	attachText = (node) => {
		const {textRef} = this.props;

		this.textNode = node;

		//NOTE: We are waiting to call the textRef back until after we've set and rendered the maxHeight,
		//but we don't need to wait when we are unmounting.
		if (!node && textRef) {
			textRef(node);
		} 

		this.setup();
	}

	state = {style: {}, settled: false}

	componentDidUpdate (prevProps) {
		const {limitLines} = this.props;
		const {limitLines:oldLines} = prevProps;

		if (limitLines !== oldLines) {
			this.setup();
		}
	}


	setup () {
		if (!this.textNode) { return; }

		const {limitLines, textRef} = this.props;
		const {lineHeight} = getStyles(this.textNode, ['lineHeight']);
		const max = Math.ceil(lineHeight * (limitLines || 1));


		this.setState({
			style: {
				maxHeight: `${max}px`
			},
			settled: true
		}, () => {
			if (textRef) {
				textRef(this.textNode);
			}
		});
	}


	render () {
		const {children, style:propStyle, className, limitLines, ...otherProps} = this.props;
		const {style:stateStyle, settled} = this.state;
		const styles = {...(propStyle || {}), ...(stateStyle || {})};
		const Text = React.Children.only(children);

		return React.cloneElement(
			Text,
			{
				...otherProps,
				className: cx(className, 'nti-limit-lines', {single: limitLines === 1, settled}),
				style: styles,
				ref: this.attachText
			}
		);
	}
}
