import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {ItemChanges} from '../mixins';

export default createReactClass({
	displayName: 'Favorite',
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
		item.favorite()
			.then(()=> this.setState({loading: false}));
	},


	render () {
		let {item, asButton} = this.props;

		let cls = cx('favorite', {
			active: item.hasLink('unfavorite'),
			button: asButton
		});

		const Tag = asButton ? 'button' : 'a';
		const extraProps = asButton ? {type: 'button'} : {href: '#'};

		return (
			<Tag {...extraProps} className={cls} onClick={this.onClick}/>
		);
	}
});
