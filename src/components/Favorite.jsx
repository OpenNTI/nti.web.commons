import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {ItemChanges} from '../mixins';

export default createReactClass({
	displayName: 'Favorite',
	mixins: [ItemChanges],

	propTypes: {
		item: PropTypes.object.isRequired
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		let {item} = this.props;

		this.setState({loading: true});
		item.favorite()
			.then(()=> this.setState({loading: false}));
	},


	render () {
		let {item} = this.props;

		let cls = cx('favorite', {
			active: item.hasLink('unfavorite')
		});

		return (
			<a className={cls} href="#" onClick={this.onClick}/>
		);
	}
});
