import './Field.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import DateTime from '../../../date-time';
import LabeledValue from '../../LabeledValue';

const DEFAULT_TEXT = {
	Creator: 'Uploaded By',
	CreatedTime: 'Date Uploaded',
};

const t = scoped('common.components.content-resources.inspector', DEFAULT_TEXT);

const capitalize = x => x[0].toUpperCase() + x.substr(1);

Field.propTypes = {
	field: PropTypes.string.isRequired,
	item: PropTypes.object.isRequired,
};

export default function Field(props) {
	const { field, item } = props;
	if (!item || !field) {
		return null;
	}
	const cappedField = capitalize(field);

	const getter = `get${cappedField}`;

	let value = item[getter] ? item[getter]() : item[field];

	if (cappedField === 'Creator') {
		// value = (
		// 	<DisplayName entity={value}/>
		// );
	} else if (value instanceof Date) {
		value = <DateTime date={value} />;
	}

	return (
		<div className="resource-viewer-inspector-file-field">
			<LabeledValue label={t(cappedField)}>{value}</LabeledValue>
		</div>
	);
}
