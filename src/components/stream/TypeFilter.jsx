import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Checkbox from '../Checkbox';

class TypeFilter extends React.Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		options: PropTypes.arrayOf(PropTypes.shape({
			label: PropTypes.string.isRequired,
			value: PropTypes.string.isRequired
		})),
		values: PropTypes.arrayOf(PropTypes.string),
		onChange: PropTypes.func.isRequired
	}

	renderTypeOption (option) {
		const { values } = this.props;
		const selected = (values || []).includes(option.value);
		const cls = cx('option', 'type-filter', { selected });
		const onChange = () => this.props.onChange(option, !selected);

		return (
			<div key={option.value} className={cls}>
				<Checkbox onChange={onChange} checked={selected} />
				<span onClick={onChange}>{option.label}</span>
			</div>
		);
	}

	render () {
		const { options, title } = this.props;

		return (
			<div className="stream-type-filter">
				<div className="option-title">{title}</div>
				{ options.map(option => this.renderTypeOption(option)) }
			</div>
		);
	}
}

export default TypeFilter;
