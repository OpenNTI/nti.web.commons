import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class LabeledValue extends React.PureComponent {
	static propTypes = {
		label: PropTypes.any,
		children: PropTypes.any,
		className: PropTypes.string,
		arrow: PropTypes.bool,
		disabled: PropTypes.bool
	};

	domNode = React.createRef();

	getDOMNode () {
		return this.domNode.current;
	}

	render () {
		const {arrow, children, className, label, disabled, ...otherProps} = this.props;
		const classes = cx('labeled-value', className, {
			'arrow-down': arrow,
			disabled
		});

		return (
			<div {...otherProps} className={classes} ref={this.domNode}>
				<label>{label}</label>
				<div className="value">
					{children}
				</div>
			</div>
		);
	}
}
