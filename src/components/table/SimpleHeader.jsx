import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {ASCENDING, DESCENDING} from './Constants';

export default class SimpleHeader extends React.Component {
	static propTypes = {
		sortKey: PropTypes.string,
		sortOn: PropTypes.string,
		sortDirection: PropTypes.string,
		name: PropTypes.string,
		onSortChange: PropTypes.func
	}


	sort = () => {
		const {onSortChange, sortDirection, sortKey} = this.props;

		if(onSortChange && sortKey) {
			return onSortChange(sortKey, sortDirection === ASCENDING ? DESCENDING : ASCENDING);
		}
	}


	render () {
		const {onSortChange, sortKey, sortOn, sortDirection, name} = this.props;
		const isSorted = sortKey && sortOn === sortKey;

		const classes = cx(
			{
				sortable: Boolean(onSortChange) && Boolean(sortKey),
				sorted: isSorted,
				asc: isSorted && sortDirection === ASCENDING,
				desc: isSorted && sortDirection === DESCENDING,
			}
		);

		return (
			<div onClick={this.sort} className={classes}>
				<span>{name}</span>
				{sortKey && onSortChange && isSorted ? sortDirection === ASCENDING ? <i className="icon-chevron-down"/> : <i className="icon-chevron-up"/> : null}
			</div>
		);
	}
}
