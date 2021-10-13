import PropTypes from 'prop-types';
import cx from 'classnames';

import { Button } from '@nti/web-core';

const Header = styled.div`
	align-items: center;
	flex: 0 0 auto;
	display: flex;
	flex-direction: row;
	height: 50px;
	line-height: normal;
	font-weight: 300;
	text-align: center;
	padding: 0 10px;
	background-color: white;
	border-bottom: solid 1px #ddd;

	[icon] {
		display: initial;
		& + [icon-label] {
			display: none;
		}
	}
`;

const Action = styled(Button)`
	display: flex;
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
	padding: 0 10px;

	/* centering */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const Save = styled(Action)`
	color: var(--primary-blue);
`;

const Cancel = styled(Action)`
	[icon] {
		font-size: 2em;
		color: var(--primary-grey);
	}
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
				{onSave && save}
			</Save>
		</Header>
	);
}
