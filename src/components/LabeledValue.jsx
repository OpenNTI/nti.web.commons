import './LabeledValue.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { v4 as uuid } from 'uuid';

export default class LabeledValue extends React.PureComponent {
	static propTypes = {
		label: PropTypes.any,
		children: PropTypes.any,
		className: PropTypes.string,
		arrow: PropTypes.bool,
		disabled: PropTypes.bool,
	};

	domNode = React.createRef();

	constructor(props) {
		super(props);

		this.id = uuid();
	}

	getDOMNode() {
		return this.domNode.current;
	}

	render() {
		const {
			arrow,
			children,
			className,
			label,
			disabled,
			...otherProps
		} = this.props;
		const classes = cx('labeled-value', className, {
			'arrow-down': arrow,
			disabled,
		});

		return (
			<div {...otherProps} className={classes} ref={this.domNode}>
				<label id={this.id}>{label}</label>
				<div className="value" aria-labelledby={this.id}>
					{children}
				</div>
			</div>
		);
	}
}
