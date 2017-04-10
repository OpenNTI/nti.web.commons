import React from 'react';
import PropTypes from 'prop-types';

export default class extends React.Component {
	static displayName = 'SelectBoxItem';

	static propTypes = {
		option: PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.any
		}),
		onClick: PropTypes.func
	};

	onClick = (e) => {
		const {option, onClick} = this.props;
		if(onClick) {
			e.stopPropagation();
			e.preventDefault();
		}

		onClick && onClick(option.value || option.label);
	};

	render () {
		const {option} = this.props;

		return (
			<li onClick={this.onClick}><span className="option-label">{option.label}</span></li>
		);
	}
}
