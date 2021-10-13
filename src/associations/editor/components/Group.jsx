import './Group.scss';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { getEditorCmpFor } from '../../types';

function renderSubGroup(group, associations) {
	const { items } = group;

	if (!items.length) {
		return null;
	}

	return (
		<li>
			{group.label && <h5>group.label</h5>}
			{renderItems(items, associations)}
		</li>
	);
}

function renderSingleItem(item, associations) {
	const Editor = getEditorCmpFor(item);

	if (!Editor) {
		return null;
	}

	return (
		<li>
			<Editor item={item} associations={associations} />
		</li>
	);
}

function renderItem(item, associations) {
	return item.isAssociationsGroup
		? renderSubGroup(item, associations)
		: renderSingleItem(item, associations);
}

function renderItems(items, associations) {
	items = items || [];

	return (
		<TransitionGroup component="ul" className="association-group-list">
			{items.map(x => (
				<CSSTransition
					key={x.NTIID || x.ID}
					classNames="fadeAndCollapse"
					timeout={300}
				>
					{renderItem(x, associations)}
				</CSSTransition>
			))}
		</TransitionGroup>
	);
}

AssociationGroup.propTypes = {
	group: PropTypes.object,
	associations: PropTypes.object,
};
export default function AssociationGroup({ group, associations }) {
	const { label, items } = group;

	return (
		<div className="associations-group">
			{label && <h4>{label}</h4>}
			{renderItems(items, associations)}
		</div>
	);
}
