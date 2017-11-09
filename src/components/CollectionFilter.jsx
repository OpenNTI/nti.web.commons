import React from 'react';
import PropTypes from 'prop-types';
import {LocalStorage} from 'nti-web-storage';

import FilterableView from './FilterableView';
import DefaultPath from './DefaultPath';

//@deprecated: This, FilterBar, & DefaultPath probably belong in the mobile app code... the filter data structure is not generic.
export default class Filter extends React.Component {
	static propTypes = {
		/**
		 *	An array or object with a filter() method.
		 */
		list: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.shape({
				filter: PropTypes.func
			})
		]),

		/**
		 *	A (single) component for rendering the (filtered) list.
		 */
		children: PropTypes.element.isRequired,

		/** filters should be a collection of named filter functions.
		 * for example:
		 *	{
		 * 		Odds (item,index,array) {
		 * 			return index % 2 === 1;
		 * 		},
		 * 		Evens (item,index,array) {
		 * 			return index % 2 === 0;
		 * 		}
		 *	}
		 */
		filters: PropTypes.array,


		title: PropTypes.string,


		defaultFilter: PropTypes.string,


		localStorageKey: PropTypes.string
	}

	static defaultProps = {
		localStorageKey: null,
		list: [],
		filters: {}
	}


	static childContextTypes = {
		setFilter: PropTypes.func
	}


	state = {}


	getChildContext = () => ({
		setFilter: this.setFilter
	})


	readStore ({localStorageKey} = this.props) {
		const key = localStorageKey;
		if (!key) {
			throw new Error('The "localStorageKey" is required.');
		}

		if (this.state.key !== key) {
			this.setState({
				selected: LocalStorage.getItem(key)
			});
		}
	}


	setFilter = (filterValue) => {
		const {localStorageKey: key} = this.props;
		// this.setState({selected: filterValue});
		LocalStorage.setItem(key, filterValue);
	}


	componentWillMount () {
		this.readStore();
		LocalStorage.addListener('change', this.onStorageChanged);
	}


	componentWillReceiveProps (nextProps) {
		this.readStore(nextProps);
	}


	componentWillUnmount () {
		LocalStorage.removeListener('change', this.onStorageChanged);
	}


	onStorageChanged = () => this.readStore()


	render () {
		const {selected} = this.state;
		const {children, list, filters} = this.props;
		if(!filters || filters.length === 0) {
			//console.debug('No filters. Returning list view.');
			return React.cloneElement(children, {list: list});
		}

		const [fallback, ...views] = this.getViews();

		const view = views.find(x => x.path === selected) || fallback;

		return view.render();
	}


	getViews = () => {
		const {children, defaultFilter, list, filters, title} = this.props;
		const listComp = children;

		const fallback = {
			render: () => (
				<DefaultPath
					key="default"
					filters={filters}
					list={list}
					defaultFilter={defaultFilter}
				/>
			)
		};

		return [fallback, ...Object.keys(filters).map(filtername => {
			const filter = filters[filtername];
			const filterpath = filter.kind || filtername.toLowerCase();
			return ({
				path: filterpath,
				render: () => (
					<FilterableView
						key={filterpath}
						path={filterpath}
						filter={filter}
						filtername={filtername}
						filterpath={filterpath}

						list={list}
						listcomp={React.cloneElement(listComp, {list: list})}
						filters={filters}
						title={title}
					/>
				)
			});
		})];
	};
}
