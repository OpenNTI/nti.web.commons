import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class extends React.Component {
	static displayName = 'Toggle';

	static propTypes = {
		active: PropTypes.string,
		options: PropTypes.arrayOf(PropTypes.string).isRequired,
		onToggle: PropTypes.func.isRequired,

		children: PropTypes.any
	};

	onToggle = (e) => {
		e.preventDefault();
		e.stopPropagation();

		this.props.onToggle(e.target.getAttribute('data-option'));
	};

	render () {
		const {props: {active, options, children}} = this;
		return (
			<div className="toggle-group-container">
				<ul className="toggle-group">
					{options.map(option =>

						<li key={option} className={cx('toggle-option', {'active': option === active})}>
							<a href="#" data-option={option} onClick={this.onToggle}>{option}</a></li>

					)}

					{children}
				</ul>
			</div>
		);
	}
}
