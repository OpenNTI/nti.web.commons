import React from 'react';

import cx from 'classnames';

import {Mixins} from 'nti-web-commons';

export default React.createClass({
	displayName: 'Like',
	mixins: [Mixins.ItemChanges],

	propTypes: {
		item: React.PropTypes.object.isRequired
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
