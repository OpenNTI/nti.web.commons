import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class extends React.Component {
	static displayName = 'SelectBoxItem';

	static propTypes = {
		option: PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.any
		}),
		onClick: PropTypes.func,
		selected: PropTypes.bool
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
		const {option, selected} = this.props;

		const className = cx('option-label', { selected });

		return (
			<li onClick={this.onClick}><span className={className}>{option.label}</span></li>
		);
	}
}
