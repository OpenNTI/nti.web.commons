import React from 'react';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	tryAgain: 'Try Again'
};

const t = scoped('ASSOCIATION_REMOVE_BUTTON', DEFAULT_TEXT);


AssociationRemove.propTypes = {
	onRemove: React.PropTypes.func,
	error: React.PropTypes.string
};
export default function AssociationRemove ({onRemove, error}) {
	return (
		<div className="association-remove-button" onClick={onRemove}>
			{!error ?
				(<i className="icon-remove" />) :
				(<span className="try-again">{t('tryAgain')}</span>)
			}
		</div>
	);
}
