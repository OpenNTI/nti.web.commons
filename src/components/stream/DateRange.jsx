import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';

const t = scoped('nti-web-commons.stream.daterange', {
	dateRange: 'Date Range',
	reset: 'Reset'
});

export default class DateRange extends React.Component {
	static propTypes = {
		options: PropTypes.arrayOf(PropTypes.shape({
			label: PropTypes.string.isRequired,
			value: PropTypes.string
		})),
		value: PropTypes.string,
		onChange: PropTypes.func.isRequired
	}

	renderDateOption (option) {
		const { label, value } = option;
		const selected = this.props.value === value;
		const cls = cx('option', 'date-filter', { selected });

		return (
			<div key={value} className={cls} onClick={() => this.props.onChange(option)}>
				{label}
			</div>
		);
	}

	render () {
		const { options } = this.props;

		return (
			<div className="stream-date-range">
				<div className="option-title">{t('dateRange')}</div>
				{ options.map(option => this.renderDateOption(option)) }
			</div>
		);
	}
}
