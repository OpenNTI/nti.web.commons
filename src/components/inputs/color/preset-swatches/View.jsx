import React from 'react';
import PropTypes from 'prop-types';

import Swatch from './Swatch';

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0 -0.25rem;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
`;

const Item = styled.li`
	display: inline-block;
	flex: 0 0 auto;
	padding: 0;
	margin: 0 0.25rem 0.5rem;
`;

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
		<List className="nti-color-preset-swatches">
			{(swatches || []).map((preset, i) => {
				return (
					<Item key={i}>
						<Swatch
							swatch={preset}
							onSelect={onSelect}
							selected={preset.color.isSameColor(selected)}
						/>
					</Item>
				);
			})}
		</List>
	);
}
