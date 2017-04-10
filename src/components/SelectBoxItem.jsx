import React from 'react';
import PropTypes from 'prop-types';

export default React.createClass({
	displayName: 'SelectBoxItem',

	propTypes: {
		option: PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.any
		}),
		onClick: PropTypes.func
	},

	onClick (e) {
		const {option, onClick} = this.props;
		if(onClick) {
			e.stopPropagation();
			e.preventDefault();
		}

		onClick && onClick(option.value || option.label);
	},

	render () {
		const {option} = this.props;

		return (
			<li onClick={this.onClick}><span className="option-label">{option.label}</span></li>
		);
	}
});
