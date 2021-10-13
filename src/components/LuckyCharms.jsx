import './LuckyCharms.scss';
import PropTypes from 'prop-types';

import Favorite from './Favorite';
import Like from './Like';

LuckyCharms.propTypes = {
	item: PropTypes.object.isRequired,
	asButton: PropTypes.bool,
};
export default function LuckyCharms(props) {
	let { item, asButton } = props;

	if (!item || !item.isTopLevel || item.placeholder) {
		// console.warn('Item doesn\'t have isTopLevel method. bailing.');
		return null;
	}

	return (
		<div className="charms">
			<Like item={item} asButton={asButton} />
			{item.isTopLevel() && <Favorite item={item} asButton={asButton} />}
		</div>
	);
}
