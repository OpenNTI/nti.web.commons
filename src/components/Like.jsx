import './Like.scss';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {ItemChanges} from '../mixins';

export default createReactClass({
	displayName: 'Like',
	mixins: [ItemChanges],

	propTypes: {
		item: PropTypes.object.isRequired,
		asButton: PropTypes.bool
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
		let {item, asButton} = this.props;
		let {LikeCount} = item;

		let count = LikeCount || '';

		let cls = cx('like', {
			active: item.hasLink('unlike'),
			'button-like': asButton,
			count: !!count
		});


		const Tag = asButton ? 'span' : 'a';
		const extraProps = asButton ? {role: 'button', tabIndex: '0'} : {href: '#'};

		return (
			<Tag {...extraProps} className={cls} onClick={this.onClick}>{count}</Tag>
		);
	}
});
