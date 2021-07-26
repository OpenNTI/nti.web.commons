import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from '../Button';

const Header = styled.div`
	display: flex;
	flex-direction: row;
	height: 50px;
	line-height: normal;
	font-weight: 300;
	text-align: center;
	background-color: white;
	border-bottom: solid 1px #ddd;
	padding: 0 1rem;
	align-items: center;
`;

const Title = styled.div`
	text-overflow: ellipsis;
	white-space: nowrap;
	color: var(--primary-grey);
	font-size: 1.125rem;
	font-weight: bold;
	font-family: var(--legacy-header-font-family);
	border: none;
	flex-grow: 1;
	overflow: hidden;
	padding: 0 0.5rem;

	/* centering */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Save = styled(Button)`
	color: var(--primary-blue);
`;

const Cancel = styled(Button)`
	/* placeholder */
`;

ActionHeader.propTypes = {
	cancel: PropTypes.string.isRequired,
	save: PropTypes.string.isRequired,
	title: PropTypes.node.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};

export function ActionHeader({
	className,
	cancel,
	title,
	save,
	onCancel,
	onSave,
}) {
	return (
		<Header className={cx('action-header', className)}>
			<Cancel className="action-cancel" onClick={onCancel} plain>
				{cancel}
			</Cancel>
			<Title className="action-title">{title}</Title>
			<Save className="action-save" onClick={onSave} plain>
				{save}
			</Save>
		</Header>
	);
}
