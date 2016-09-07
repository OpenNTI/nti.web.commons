import React from 'react';
import ListItem from '../components/ListItem';
import ItemInfo from '../components/ItemInfo';

DefaultEditor.propTypes = {
	item: React.PropTypes.object,
	associations: React.PropTypes.object
};
export default function DefaultEditor ({item, associations}) {
	return (
		<ListItem active={associations.isUsed(item)}>
			<ItemInfo label={item.label}/>
		</ListItem>
	);
}
