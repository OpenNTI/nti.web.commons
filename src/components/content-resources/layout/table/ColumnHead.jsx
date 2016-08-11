import React, {PropTypes} from 'react';
import cx from 'classnames';

export default class ColumnHead extends React.Component {

	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any,
		currentSort: PropTypes.object,
		sortOn: PropTypes.string,
		onSort: PropTypes.func
	}


	onClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const {onSort, sortOn, currentSort = {}} = this.props;

		const flip = x => x === 'asc' ? 'desc' : 'asc';

		if (onSort) {
			const sortOrder = (currentSort.sortOn === sortOn) ? flip(currentSort.sortOrder) : 'asc';
			onSort(sortOn, sortOrder);
		}
	}


	render () {
		const {children, className, sortOn, currentSort = {}} = this.props;

		const isSortedOn = sortOn === currentSort.sortOn;

		const cls = cx('column-head', className, {
			sorted: isSortedOn,
			[currentSort.sortOrder || 'asc']: isSortedOn
		});

		return (
			<th className={cls} onClick={this.onClick}>
				{children}
				<span className="arrow"/>
			</th>
		);
	}
}
