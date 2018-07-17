import React from 'react';
import PropTypes from 'prop-types';

import Radio from './Radio';

export default class RadioGroup extends React.Component {

	static propTypes = {
		name: PropTypes.string,
		options: PropTypes.array,
		value: PropTypes.string,
		initialValue: PropTypes.string,
		onChange: PropTypes.func
	}

	componentDidMount () {
		this.setup();
	}

	componentDidUpdate (prevProps) {
		//FIXME: Honor controlled value pattern
		if (this.props.initialValue !== prevProps.initialValue) {
			this.setup();
		}
	}


	setup (props = this.props) {
		//eslint-disable-next-line react/no-direct-mutation-state
		const {initialValue} = props;
		this.setState({
			selected: initialValue
		});
	}


	onChange = (e) => {
		const selected = e.target.value;
		this.setState({ selected });
		if(this.props.onChange) {
			this.props.onChange(selected);
		}
	}


	get value () {
		return this.state.selected;
	}


	render () {
		const {name, options} = this.props;
		const {selected} = this.state;
		return (
			<ul className="radio-group">
				{options.map(o => (
					<li key={o}>
						<Radio name={name} label={o} value={o} onChange={this.onChange} checked={selected === o} />
					</li>
				))}
			</ul>
		);
	}
}
