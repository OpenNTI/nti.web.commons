import React from 'react';
import Radio from './Radio';

export default class RadioGroup extends React.Component {
	constructor (props) {
		super(props);
		this.setup();
	}

	static propTypes = {
		name: React.PropTypes.string,
		options: React.PropTypes.array,
		value: React.PropTypes.string,
		onChange: React.PropTypes.func
	}


	componentWillReceiveProps (nextProps) {
		this.setup(nextProps);
	}


	setup (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {initialValue} = props;
		setState({
			selected: initialValue
		});
	}


	onChange = (e) => {
		const selected = e.target.value;
		this.setState({
			selected
		});
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
