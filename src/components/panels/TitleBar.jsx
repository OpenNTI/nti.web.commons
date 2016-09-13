import React from 'react';
import cx from 'classnames';

TitleBar.propTypes = {
	title: React.PropTypes.string.isRequired,
	className: React.PropTypes.string,
	iconAction: React.PropTypes.func,
	iconCls: React.PropTypes.string,
	iconLabel: React.PropTypes.string
};
export default function TitleBar ({title, className, iconAction, iconCls = 'icon-light-x', iconLabel = 'Close'}) {
	const cls = cx('panel-title-bar', className);

	return (
		<div className={cls}>
			<h1>{title}</h1>
			{iconAction && (<i className={iconCls} role="button" data-tip={iconLabel} aria-label={iconLabel} onClick={iconAction} />)}
		</div>
	);
}
