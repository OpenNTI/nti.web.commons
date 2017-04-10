import React from 'react';
import PropTypes from 'prop-types';

import DrillUp from '../DrillUp';

ParentFolder.propTypes = {
	folder: PropTypes.shape({getFileName: PropTypes.func}),
	emptyComponent: PropTypes.func
};

export default function ParentFolder (props) {
	const {folder, emptyComponent: Empty, ...otherProps} = props;
	const parent = folder && folder.getParentFolder();
	return !parent ? (
		!Empty ? null : (
			<Empty/>
		)
	) : (
		<DrillUp {...otherProps} label={parent.getFileName()}/>
	);
}
