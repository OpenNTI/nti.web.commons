import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	SearchScopeLabel: 'Search:',
	SearchScopeRootLabel: 'All Files'
};

const t = scoped('common.components.content-resources', DEFAULT_TEXT);

const SCOPE_TYPE = PropTypes.shape({
	getFileName: PropTypes.func
});

SearchScopeBar.propTypes = {
	scopes: PropTypes.arrayOf(SCOPE_TYPE),
	scope: SCOPE_TYPE,
	onChange: PropTypes.func
};

export default function SearchScopeBar (props) {
	const {scopes, scope, onChange} = props;

	const getOnChange = (item) => () => onChange(item);

	return (
		<div className="content-resource-search-scope-bar">
			<div className="label">{t('SearchScopeLabel')}</div>
			{scopes.map((item, i) => item && (

				<div key={i} onClick={item === scope ? void 0 : getOnChange(item)}
					className={cx('item', {active: scope === item})}>
					{item.isRoot ? t('SearchScopeRootLabel') : item.getFileName()}
				</div>

			))}
		</div>
	);
}
