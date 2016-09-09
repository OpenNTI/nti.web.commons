import React from 'react';
import ListItem from '../components/ListItem';
import ItemInfo from '../components/ItemInfo';

DefaultEditor.propTypes = {
	item: React.PropTypes.object,
	associations: React.PropTypes.object
};
export default function DefaultEditor ({item, associations}) {
	const active = associations.isUsed(item);

	return (
		<ListItem active={active}>
			<ItemInfo label={item.label} subLabels={[item.group.label, 'Test label']}/>
		</ListItem>
	);
}
