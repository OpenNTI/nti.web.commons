import PropTypes from 'prop-types';

import Favorite from './Favorite';
import Like from './Like';

LuckyCharms.propTypes = {
	item: PropTypes.object.isRequired,
};
export default function LuckyCharms({ item }) {
	if (!item || !item.isTopLevel || item.placeholder) {
		// console.warn('Item doesn\'t have isTopLevel method. bailing.');
		return null;
	}

	return (
		<div
			className="charms"
			css={css`
				position: absolute;
				top: 0;
				right: 0;

				/* TODO: remove z-index */
				z-index: 1;
			`}
		>
			<Like
				item={item}
				css={css`
					& > [data-button-label] {
						color: var(--primary-blue);
						text-decoration: none;
					}
				`}
			/>
			{item.isTopLevel() && <Favorite item={item} />}
		</div>
	);
}
