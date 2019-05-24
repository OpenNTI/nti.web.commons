import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Token.css';
import TokenDisplay from './TokenDisplay';

const cx = classnames.bind(Styles);

export default class Token extends React.Component {
	static propTypes = {
		token: PropTypes.object,
		selected: PropTypes.bool,
		onRemove: PropTypes.func,
		onSelect: PropTypes.func
	}

	onRemove = (e) => {
		e.stopPropagation();
		e.preventDefault();

		const {onRemove, token} = this.props;

		if (onRemove) {
			onRemove(token);
		}
	}

	onSelect = (e) => {
		const {onSelect, token} = this.props;

		if (onSelect) {
			onSelect(token);
		}
	}

	render () {
		const {token, onRemove, selected} = this.props;

		return (
			<div className={cx('token', {selected})} onClick={this.onSelect} role="button">
				<TokenDisplay className={cx('token-display')} token={token} />
				{!!onRemove && (
					<div className={cx('token-remove')} onClick={this.onRemove} role="button">
						<i className="icon-remove" />
					</div>
				)}
			</div>
		);
	}
}
