import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {ItemChanges} from '../mixins';

export default React.createClass({
	displayName: 'Like',
	mixins: [ItemChanges],

	propTypes: {
		item: PropTypes.object.isRequired
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		let {item} = this.props;

		this.setState({loading: true});
		item.like()
			.then(()=> this.setState({loading: false}));
	},


	render () {
		let {item} = this.props;
		let {LikeCount} = item;

		let cls = cx('like', {
			active: item.hasLink('unlike')
		});

		let count = LikeCount || '';

		return (
			<a className={cls} href="#" onClick={this.onClick}>{count}</a>
		);
	}
});
