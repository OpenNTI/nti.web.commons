import React from 'react';
import PropTypes from 'prop-types';

import Asset from './Asset';

export default class AssetBackground extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object,
		style: PropTypes.object,
		type: PropTypes.string
	}

	constructor (props) {
		super(props);
	}

	computeProps = (resolvedUrl) => {
		const { style } = this.props;

		const updatedStyle = { ...(style || {}) };

		updatedStyle.backgroundImage = `url(${resolvedUrl})`;

		return { style: updatedStyle };
	}

	render () {
		const { type, contentPackage, ...otherProps } = this.props;

		delete otherProps.style;

		return (
			<Asset contentPackage={contentPackage} type={type} computeProps={this.computeProps}>
				<div { ...otherProps}/>
			</Asset>
		);
	}
}
