import React from 'react';
import PropTypes from 'prop-types';

import {trimText, getStyles} from '../utils';

function isOverflown (node, lineHeight) {
	if (!node) { return false; }

	const nodeHeight = node.clientHeight || node.offsetHeight;
	const scrollHeight = node.scrollHeight;
	const buffer = scrollHeight % lineHeight;

	return scrollHeight - nodeHeight > buffer;
}

class Overflow extends React.Component {
	static propTypes = {
		text: PropTypes.string,
		overflow: PropTypes.string,
		children: PropTypes.any,
		textRef: PropTypes.func
	}


	attachText = (node) => {
		const {textRef} = this.props;

		this.textNode = node;
		if (textRef) { textRef(node);}

		setImmediate(() => this.setup());
	}

	constructor (props) {
		super(props);

		this.state = {
			text: props.text
		};
	}

	componentDidUpdate (prevProps) {
		const {text} = this.props;
		const {text:oldText} = prevProps;

		if (text !== oldText) {
			this.setup();
		}
	}


	setup () {
		if (!this.textNode) { return; }

		const {lineHeight} = getStyles(this.textNode, ['lineHeight']);

		const trim = () => {
			const {text} = this.state;

			if (isOverflown(this.textNode, lineHeight) && text) {
				this.setState({
					ellipsed: true,
					text: trimText(text)
				}, () => {
					setImmediate(() => trim());
				});
			}

		};

		trim();
	}


	render () {
		const {children, text:fullText, overflow, ...otherProps} = this.props;
		const {text, ellipsed} = this.state;
		const Text = React.Children.only(children);

		return React.cloneElement(
			Text,
			{
				...otherProps,
				text: ellipsed ? `${text}${overflow}` : text,
				title: ellipsed ? fullText : null,
				ref: this.attachText
			}
		);
	}
}

const Wrapper = (props, ref) => (<Overflow {...props} textRef={ref} />);
export default React.forwardRef(Wrapper);