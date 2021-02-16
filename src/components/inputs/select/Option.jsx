import './Option.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class SelectInputOption extends React.Component {
	static propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		className: PropTypes.string,
		children: PropTypes.node,
		matches: PropTypes.func,

		onClick: PropTypes.func,
		selected: PropTypes.bool,
		focused: PropTypes.bool,
		display: PropTypes.bool,

		checkable: PropTypes.bool,
		checked: PropTypes.bool,
		removable: PropTypes.bool,
		onRemove: PropTypes.func,
	};

	onClick = e => {
		const { onClick, value, display } = this.props;

		if (onClick && !display) {
			onClick(value, e);
		}
	};

	onRemove = e => {
		const { onRemove, value } = this.props;

		if (onRemove) {
			onRemove(value, e);
		}
	};

	render() {
		const {
			value,
			selected,
			checked,
			checkable,
			removable,
			focused,
			display,
			children,
		} = this.props;
		const cls = cx('nti-select-input-option', {
			selected,
			checkable,
			removable,
			focused,
			display,
		});

		return (
			<div
				role="option"
				className={cls}
				data-value={value}
				onClick={this.onClick}
			>
				{checkable && (
					<div className="check">
						{checked && <i className="icon-check" />}
					</div>
				)}
				<div className="content">{children}</div>
				{removable && (
					<div className="remove" onClick={this.onRemove}>
						<i className="icon-bold-x" />
					</div>
				)}
			</div>
		);
	}
}
