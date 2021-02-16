import React from 'react';
import PropTypes from 'prop-types';

/**
 * @deprecated - There are a few ideological problems with this component.
 * 1) The onChange is delayed/buffered. (I know thats the intent, but thats not where the buffer should be)
 * 2) There is no "prop-change" way to change the value. This breaks the React paradigm.
 */

export default class BufferedInput extends React.Component {
	static propTypes = {
		defaultValue: PropTypes.string,
		onChange: PropTypes.func,
		delay: PropTypes.number,
	};

	attachRef = x => (this.input = x);

	componentDidMount() {
		//eslint-disable-next-line no-console
		console.warn(
			'BufferedInput is deprecated. Please attempt to shift to a regular input and buffer the method onChange calls.'
		);
	}

	clear() {
		const { input } = this;
		input.value = '';
		this.onChange({
			target: input,
			type: 'change',
			persist() {},
			preventDefault() {},
			stopPropagation() {},
		});
	}

	focus() {
		this.input.focus();
	}

	onChange = e => {
		const { delay = 0, onChange } = this.props;
		if (!onChange) {
			return;
		}

		let { inputBufferDelayTimer } = this;
		if (inputBufferDelayTimer) {
			clearTimeout(inputBufferDelayTimer);
		}

		// take this event out of the pool since we need to access it asynchronously.
		// see https://facebook.github.io/react/docs/events.html#event-pooling
		e.persist();

		this.inputBufferDelayTimer = setTimeout(() => onChange(e), delay);
	};

	render() {
		const props = { ...this.props };

		delete props.delay; //don't pass "our" props to the spread

		return (
			<input
				{...props}
				ref={this.attachRef}
				onChange={this.onChange}
				value={void 0}
			/>
		);
	}
}
