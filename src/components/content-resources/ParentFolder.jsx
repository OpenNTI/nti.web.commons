import React, {PropTypes} from 'react';
import DrillUp from '../DrillUp';

ParentFolder.propTypes = {
	folder: PropTypes.shape({getFileName: PropTypes.func}),
	emptyComponent: PropTypes.func
};

export default function ParentFolder (props) {
	const {folder, emptyComponent: Empty} = props;
	const parent = folder && folder.getParentFolder();
	return !parent ? (
		!Empty ? null : (
			<Empty/>
		)
	) : (
		<DrillUp {...props} label={parent.getFileName()}/>
	);
}
