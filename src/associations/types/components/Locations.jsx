import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	locations: {
		one: '%(count)s Location',
		other: '%(count)s Locations'
	}
};

const t = scoped('ASSOCIATION_LOCATIONS', DEFAULT_TEXT);


AssociationLocations.propTypes = {
	count: PropTypes.number
};
export default function AssociationLocations ({count}) {
	return (
		<div className="association-locations">
			{t('locations', {count})}
		</div>
	);
}
