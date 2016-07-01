import React, {PropTypes} from 'react';
import cx from 'classnames';
import SelectionModel from 'nti-commons/lib/SelectionModel';

Section.propTypes = {
	className: PropTypes.string,
	items: PropTypes.array,
	selection: PropTypes.instanceOf(SelectionModel),
	type: PropTypes.func //Component
};

export default function Section (props) {
	const {className, items, selection, type: Type} = props;
	return (
		<div className={cx('section', className)}>
			{items.map(i =>
				<Type key={i.getID()} item={i} selection={selection}/>
			)}
		</div>
	);
}
