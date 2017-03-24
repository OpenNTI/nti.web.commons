import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	SearchScopeLabel: 'Search:',
	SearchScopeRootLabel: 'All Files'
};

const t = scoped('CONTENT_RESOURCES', DEFAULT_TEXT);

const SCOPE_TYPE = React.PropTypes.shape({
	getFileName: React.PropTypes.func
});

SearchScopeBar.propTypes = {
	scopes: React.PropTypes.arrayOf(SCOPE_TYPE),
	scope: SCOPE_TYPE,
	onChange: React.PropTypes.func
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
