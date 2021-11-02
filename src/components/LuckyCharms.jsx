import './LuckyCharms.scss';
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
		<div className="charms">
			<Like item={item} />
			{item.isTopLevel() && <Favorite item={item} />}
		</div>
	);
}
