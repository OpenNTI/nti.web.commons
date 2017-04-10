import React from 'react';
import PropTypes from 'prop-types';
import {getEnvironment} from 'react-router-component/lib/environment/LocalStorageKeyEnvironment';
import {Locations, Location, NotFound as DefaultRoute} from 'react-router-component';

import FilterableView from './FilterableView';
import DefaultPath from './DefaultPath';

export default class extends React.Component {
	static displayName = 'Filter';

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
	};

	static defaultProps = {
		localStorageKey: null,
		list: [],
		filters: {}
	};

	componentWillMount () {
		let key = this.props.localStorageKey;
		if (!key) {
			throw new Error('The "localStorageKey" is required.');
		}
		let env = getEnvironment(key);
		this.setState({env});
	}

	render () {
		let {env} = this.state || {};
		let {children, list, filters} = this.props;

		if (!env) { return; }

		if(!filters || filters.length === 0) {
			//console.debug('No filters. Returning list view.');
			return React.cloneElement(children, {list: list});
		}

		return (
			<Locations environment={env}>
				{this.getRoutes()}
			</Locations>
		);
	}

	getRoutes = () => {
		let {children, defaultFilter, list, filters, title} = this.props;
		let listComp = children;


		let routes = Object.keys(filters).map(filtername => {
			let filter = filters[filtername];
			let filterpath = filter.kind || filtername.toLowerCase();
			return (
				<Location
					key={filterpath}
					path={`/${filterpath}`}
					filter={filter}
					filtername={filtername}
					filterpath={filterpath}
					handler={FilterableView}

					list={list}
					listcomp={React.cloneElement(listComp, {list: list})}
					filters={filters}
					title={title}
				/>
			);
		});

		routes.push(
			<DefaultRoute
				key="default"
				handler={DefaultPath}
				filters={filters}
				list={list}
				defaultFilter={defaultFilter}
				/>
			);

		return routes;
	};
}
