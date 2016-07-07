import React from 'react';

export default class BufferedInput extends React.Component {
	static propTypes = {
		defaultValue: React.PropTypes.string,
		onChange: React.PropTypes.func,
		delay: React.PropTypes.number
	}

	attachRef = x => this.input = x


	clear () {
		const {input} = this;
		input.value = '';
		this.onChange({
			target: input,
			type: 'change',
			persist () {},
			preventDefault () {},
			stopPropagation () {}
		});
	}

	focus () {
		this.input.focus();
	}


	onChange = (e) => {
		const {delay = 0, onChange} = this.props;
		if (!onChange) {
			return;
		}

		let {inputBufferDelayTimer} = this;
		if (inputBufferDelayTimer) {
			clearTimeout(inputBufferDelayTimer);
		}

		// take this event out of the pool since we need to access it asynchronously.
		// see https://facebook.github.io/react/docs/events.html#event-pooling
		e.persist();

		this.inputBufferDelayTimer = setTimeout(() => onChange(e), delay);
	}

	render () {
		const props = Object.assign({}, this.props);

		delete props.delay;//don't pass "our" props to the spread

		return (
			<input {...props} ref={this.attachRef} onChange={this.onChange} value={void 0}/>
		);
	}
}
