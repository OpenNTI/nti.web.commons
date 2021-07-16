import './TitleBar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

TitleBar.propTypes = {
	title: PropTypes.node.isRequired,
	className: PropTypes.string,
	iconAction: PropTypes.func,
	iconCls: PropTypes.string,
	iconLabel: PropTypes.string,
};
export default function TitleBar({
	title,
	className,
	iconAction,
	iconCls = 'icon-light-x',
	iconLabel = 'Close',
}) {
	const cls = cx('panel-title-bar', className);

	return (
		<div className={cls}>
			<h1>{title}</h1>
			{iconAction && (
				<i
					className={iconCls}
					role="button"
					data-tip={iconLabel}
					aria-label={iconLabel}
					onClick={iconAction}
				/>
			)}
		</div>
	);
}
