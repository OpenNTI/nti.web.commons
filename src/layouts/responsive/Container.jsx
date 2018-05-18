import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';

import {Query} from '../../components';

import Item from './Item';

const logger = Logger.get('common:layouts:responsive:container');


export default class ResponsiveContainer extends React.Component {
	static propTypes = {
		children: PropTypes.any
	}


	state = {}


	onWidthChange = (width) => {
		this.setState({
			width
		});
	}


	render () {
		const otherProps = {...this.props};

		delete otherProps.children;

		return (
			<Query.ElementWidth {...otherProps} onChange={this.onWidthChange}>
				{this.renderChildren()}
			</Query.ElementWidth>
		);
	}


	renderChildren () {
		const {children} = this.props;
		const {width} = this.state;

		if (width == null) { return null; }

		return (
			<React.Fragment>
				{React.Children.map(children, (child) => {
					if (child.type !== Item) {
						logger.warn('Unexpected child type given to Responsive.Container. Dropping it on the floor.');
					}

					return React.cloneElement(child, {additionalArguments: {containerWidth: width}});
				})}
			</React.Fragment>
		);
	}
}
