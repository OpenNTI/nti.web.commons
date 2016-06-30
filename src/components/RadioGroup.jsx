import React from 'react';
import Radio from './Radio';

export default class RadioGroup extends React.Component {
	constructor (props) {
		super(props);
		this.state = {};
	}

	static propTypes = {
		name: React.PropTypes.string,
		options: React.PropTypes.array,
		value: React.PropTypes.string,
		onChange: React.PropTypes.func
	}

	componentWillMount () {
		this.setup();
	}

	componentWillReceiveProps (nextProps) {
		this.setup(nextProps);
	}

	setup (props = this.props) {
		const {initialValue} = props;
		this.setState({
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
