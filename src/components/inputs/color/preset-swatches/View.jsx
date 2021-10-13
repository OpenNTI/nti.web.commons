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
	if (!swatches) { return null; }

	const rows = Array.isArray(swatches[0]) ? swatches : [swatches]

	return rows.map((row, key) => (
		<List className="nti-color-preset-swatches" key={key}>
			{(row || []).map((preset, i) => {
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
	));
}
