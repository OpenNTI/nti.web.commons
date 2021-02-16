import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Style.css';

const cx = classnames.bind(Styles);
const stop = e => (e.preventDefault(), e.stopPropagation());

export default class Swatch extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		swatch: PropTypes.shape({
			color: PropTypes.shape({
				rgb: PropTypes.shape({
					toString: PropTypes.func,
				}),
			}).isRequired,
			title: PropTypes.string,
		}).isRequired,
		selected: PropTypes.bool,
		onSelect: PropTypes.func,
	};

	select() {
		const { swatch, onSelect } = this.props;

		if (onSelect) {
			onSelect(swatch.color);
		}
	}

	onClick = e => {
		stop(e);
		this.select();
	};

	onKeyPress = e => {
		if (e.key === 'Enter') {
			stop(e);
			this.select();
		}
	};

	render() {
		const { className, swatch, selected } = this.props;
		const { color, title } = swatch;
		const style = {
			backgroundColor: color.rgb.toString(),
		};

		return (
			<a
				className={cx('nti-color-swatch', className, { selected })}
				tabIndex="0"
				role="button"
				title={title}
				onClick={this.onClick}
				onKeyPress={this.onKeyPress}
				style={style}
			/>
		);
	}
}
