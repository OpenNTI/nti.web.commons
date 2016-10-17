import React from 'react';

import setTextContent from 'react/lib/setTextContent';
import {Tasks, getRefHandler} from 'nti-commons';

export default class Ellipsed extends React.Component {

	static propTypes = {
		tag: React.PropTypes.string,
		measureOverflow: React.PropTypes.oneOf(['self', 'parent']).isRequired
	}


	static defaultProps = {
		tag: 'div',
		measureOverflow: 'self'
	}


	static trim = trim


	attachRef = ref => this.element = ref;


	componentDidMount () {
		Tasks.SharedExecution.clear(this.tt);
		this.tt = truncateText(this.element, this.props.measureOverflow);
	}


	componentDidUpdate () {
		Tasks.SharedExecution.clear(this.tt);
		this.tt = truncateText(this.element, this.props.measureOverflow);
	}


	render () {
		const {tag, ...otherProps} = this.props;
		delete otherProps.measureOverflow;
		const ref = getRefHandler(otherProps.ref, this.attachRef);
		return React.createElement(tag, {...otherProps, ref});
	}
}

function truncateText (el, measure) {
	let textProperty = (el.textContent != null) ? 'textContent' : 'innerText';

	let getText = () => el[textProperty];
	let setText = text => setTextContent(el, text);


	let setTitleOnce = () => {
		el.setAttribute('title', getText());
		setTitleOnce = () => {};
	};

	//if the element only has text nodes as children querySelector will return null.
	if (el.querySelector('*')) {
		console.error('EllipsisText is not safe on markup. Terminating.'); //eslint-disable-line
		return;
	}


	return Tasks.SharedExecution.schedule(() => {
		const box = (measure === 'parent') ? el.parentNode : el;
		const tooBig = () => box.scrollHeight - (box.clientHeight || box.offsetHeight) >= 1;

		function trimStep () {
			if (tooBig()) {
				if (getText() !== '...') {
					setTitleOnce();

					setText(getText().replace(/[^\.](\.*)$/, '...'));

					return Tasks.SharedExecution.schedule(trimStep);
				}
			}
		}

		return trimStep();
	});
}


export function trim (value, len, word) {
	if (value && value.length > len) {
		if (word) {
			const vs = value.substr(0, len - 2);
			const index = Math.max(
					vs.lastIndexOf(' '),
					vs.lastIndexOf('.'),
					vs.lastIndexOf('!'),
					vs.lastIndexOf('?')
				);

			if (index !== -1 && index >= (len - 15)) {
				return vs.substr(0, index) + '...';
			}
		}
		return value.substr(0, len - 3) + '...';
	}

	return value;
}
