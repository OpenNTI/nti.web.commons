import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {getStyles} from '../utils';

import Styles from './LimitLines.css';

const cx = classnames.bind(Styles);

//TODO: recompute ellipse after a resize or size change

class LimitLines extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		limitLines: PropTypes.number,
		text: PropTypes.string,
		style: PropTypes.object,
		textRef: PropTypes.func,
		children: PropTypes.any
	}

	attachText = (node) => {
		const {textRef} = this.props;

		this.textNode = node;

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
		const {text, children, style:propStyle, className, limitLines, ...otherProps} = this.props;
		const {style:stateStyle, settled} = this.state;
		const styles = {...(propStyle || {}), ...(stateStyle || {})};
		const Text = React.Children.only(children);

		return React.cloneElement(
			Text,
			{
				...otherProps,
				text,
				className: cx(className, 'nti-limit-lines', {single: limitLines === 1, settled}),
				style: styles,
				ref: this.attachText
			}
		);
	}
}


const Wrapper = (props, ref) => (<LimitLines {...props} textRef={ref} />);
export default React.forwardRef(Wrapper);
