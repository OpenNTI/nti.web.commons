import React from 'react';
import PropTypes from 'prop-types';

import Logger from '@nti/util-logger';

import FilterBar from './FilterBar';
import NoMatches from './NoMatches';

const logger = Logger.get('common:components:FilterableView');

export default class FilterableView extends React.Component {
	static propTypes = {
		filtername: PropTypes.string,
		filters: PropTypes.array,
		listcomp: PropTypes.node,

		/**
		 *	An array or object with a filter() method.
		 */
		list: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.shape({
				filter: PropTypes.func,
			}),
		]),
	};

	/**
	 * filter the list according using the currently selected filter.
	 * @param {Object} list Any object that implements filter.
	 * @returns {Object} The result of calling filter on the `list`
	 */
	filter = list => {
		if (!(list && list.filter)) {
			logger.error(
				"List should be an array (or at least have a 'filter' method. Returning an empty array. Received: %O",
				list
			);
			return [];
		}

		// default to the first filter
		let fkeys = Object.keys(this.props.filters);
		let fname = fkeys.length > 0 ? fkeys[0] : undefined;

		if (this.props.filtername) {
			// filter specified in the url, e.g. library/courses/archived
			for (let i = 0; i < fkeys.length; i++) {
				if (this.props.filtername === fkeys[i].toLowerCase()) {
					fname = fkeys[i];
					break;
				}
			}
		}

		let selectedFilter = this.props.filters[fname];
		return selectedFilter
			? {
					filter: selectedFilter,
					list: list.filter(selectedFilter.test),
			  }
			: {
					filter: null,
					list: list,
			  };
	};

	render() {
		let { filter, list } = this.filter(this.props.list);

		return (
			<div>
				<FilterBar {...this.props} />
				{!list || list.length === 0 ? (
					<NoMatches />
				) : (
					<div>
						{React.cloneElement(this.props.listcomp, {
							list,
							filter,
						})}
					</div>
				)}
			</div>
		);
	}
}
