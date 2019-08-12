import React from 'react';
import PropTypes from 'prop-types';

import {ScreenSize} from '../../decorators';

import {mergeProps} from './util';

export default
@ScreenSize()
class QueryElementWidth extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		tag: PropTypes.string,

		onChange: PropTypes.func,

		queries: PropTypes.arrayOf(PropTypes.shape({
			query: PropTypes.func,
			default: PropTypes.bool,
			props: PropTypes.object.isRequired
		}))
	}

	static defaultProps = {
		queries: [],
		tag: 'div'
	}

	state = {}


	attachRef = (x) => {
		this.ref = x;

		if (x) {
			this.computeMatches();
		}
	}


	componentDidUpdate () {
		if (this.ref) {
			this.computeMatches();
		}
	}


	computeMatches () {
		const {queries, onChange} = this.props;
		const {width:lastWidth} = this.state;
		const width = this.ref && this.ref.offsetWidth;

		if (lastWidth === width) { return; }

		if (onChange) { onChange(width); }

		let props = {};
		let defaultProps = {};
		let hasMatch = false;

		for (let query of queries) {
			if (query.query(width)) {
				hasMatch = true;
				props = mergeProps(props, query.props);
			}

			if (query.default) {
				defaultProps = mergeProps(defaultProps, query.props);
			}
		}

		if (!hasMatch) {
			props = defaultProps;
		}

		this.setState({
			width,
			extraProps: props
		});
	}



	render () {
		const {tag:Tag, ...otherProps} = this.props;
		const {extraProps} = this.state;

		delete otherProps.queries;
		delete otherProps.onChange;
		delete otherProps.screenWidth;
		delete otherProps.screenHeight;

		return (
			<Tag ref={this.attachRef} {...otherProps} {...extraProps} />
		);
	}
}
