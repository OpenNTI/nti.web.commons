import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Style.css';
import Swatch from './Swatch';

const cx = classnames.bind(Styles);

NTIColorPresets.propTypes = {
	swatches: PropTypes.arrayOf(
		PropTypes.shape({
			color: PropTypes.shape({
				isSameColor: PropTypes.func.isRequired,
			}).isRequired,
		})
	),
	selected: PropTypes.any,
	onSelect: PropTypes.func,
};
export default function NTIColorPresets({ swatches, selected, onSelect }) {
	return (
		<ul className={cx('nti-color-preset-swatches')}>
			{(swatches || []).map((preset, i) => {
				return (
					<li key={i}>
						<Swatch
							swatch={preset}
							onSelect={onSelect}
							selected={preset.color.isSameColor(selected)}
						/>
					</li>
				);
			})}
		</ul>
	);
}
