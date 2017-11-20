import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import DateTime from '../DateTime';

export default class Date extends React.Component {
	static propTypes = {
		date: PropTypes.object.isRequired,
		type: PropTypes.string.isRequired,
		selected: PropTypes.bool,
		onSelect: PropTypes.func,
		onRemove: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = {};
	}

	doRemove = () => {
		const { type, onRemove } = this.props;

		onRemove && onRemove(type);
	}

	renderRemoveButton (type, date) {
		if(!date) {
			return null;
		}

		return (<div className="remove-date" onClick={this.doRemove}><i className="icon-light-x"/></div>);
	}

	doSelect = () => {
		const { type, onSelect } = this.props;

		onSelect && onSelect(type);
	}

	render () {
		const { type, date, selected } = this.props;

		const cls = cx('date', { selected });

		return (<div className={cls} onClick={this.doSelect}>
			<div className="field-contents">
				<div className="label">{type}</div>
				<div className="value">{date ? DateTime.format(date, 'MMM. D') : ''}</div>
			</div>
			{this.renderRemoveButton(type, date)}
		</div>);
	}
}
