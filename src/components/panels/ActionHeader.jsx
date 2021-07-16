import React from 'react';
import PropTypes from 'prop-types';

const Header = styled.div`
	display: flex;
	flex-direction: row;
	height: 50px;
	line-height: 50px;
	font-weight: 300;
	text-align: center;
	background-color: white;
	border-bottom: solid 1px #ddd;
	padding: 0 1rem;
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
	text-align: center;
	overflow: hidden;
	padding: 0 0.5rem;
`;

const Save = styled.div`
	color: var(--primary-blue);
`;

const Cancel = styled.div`
	/* placeholder */
`;

ActionHeader.propTypes = {
	cancel: PropTypes.string.isRequired,
	save: PropTypes.string.isRequired,
	title: PropTypes.node.isRequired,
	onCancel: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};

export function ActionHeader({ cancel, title, save, onCancel, onSave }) {
	return (
		<Header className="action-header">
			<Cancel className="action-cancel" onClick={onCancel}>
				{cancel}
			</Cancel>
			<Title className="action-title">{title}</Title>
			<Save className="action-save" onClick={onSave}>
				{save}
			</Save>
		</Header>
	);
}
