import React from 'react';
import PropTypes from 'prop-types';

import {Mask as Loading} from './loading-indicators';

//Only Used by CollectionFilter.jsx
export default class DefaultPath extends React.Component {
	static propTypes = {
		defaultFilter: PropTypes.string,
		filters: PropTypes.array,

		/**
		 *	An array or object with a filter() method.
		 */
		list: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.shape({
				filter: PropTypes.func
			})
		]),
	}

	static contextTypes = {
		getFilter: PropTypes.func.isRequired,
		setFilter: PropTypes.func.isRequired
	}

	startRedirect () {
		clearTimeout(this.pendingRedirect);
		this.pendingRedirect = setTimeout(()=> this.performRedirect(), 1);
	}


	performRedirect () {
		let path = this.defaultFilterPath();
		if (path) {
			this.context.setFilter(path);
		}
	}


	findFilter (name) {
		return this.props.filters.find(f => f.name === name);
	}


	/**
	 *	Returns the path of the first filter that doesn't result in an emtpy list,
	 *	or the first filter if all result in empty lists,
	 *	or null if this.props.filters.length === 0
	 *
	 *	@returns {Object} The default filter or nothing.
	 */
	defaultFilterPath () {
		if (this.props.defaultFilter) {
			let dfp = this.props.defaultFilter;
			let df = (typeof dfp === 'string') ? this.findFilter(dfp) : dfp;
			return (df || {}).kind;
		}

		let {filters = [], list} = this.props;
		let result = filters.length > 0 ? filters[0].kind : null;

		filters.some(filter => {
			if (list.filter(filter.test).length > 0) {
				result = filter.kind || filter.name.toLowerCase();
				return true;
			}
			return false;
		});

		return result;
	}


	isDefaulted () {
		let {filters = []} = this.props;
		let p = this.context.getFilter() || '';

		let inSet = ()=> filters.reduce((x, f)=> x || (f.kind === p), null);


		return /^.?null$/i.test(p) || !inSet(p);
	}


	componentDidUpdate () {
		if(this.isDefaulted()) {
			this.startRedirect();
		}
	}


	componentDidMount () {
		if(this.isDefaulted()) {
			this.startRedirect();
		}
	}


	render () {
		return (<Loading/>);
	}

}
