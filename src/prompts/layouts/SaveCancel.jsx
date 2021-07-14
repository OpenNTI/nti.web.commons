import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

import Dialog from '../Dialog';
import { Responsive } from '../../layouts';
import { DialogButtons, Panels } from '../../components';

//#region 🎨 & 🛠️
const t = scoped('common.prompts.layouts.SaveCancel', {
	cancel: 'Cancel',
	save: 'Save',
	title: 'Title',
});

const DialogContainer = styled(Dialog)`
	dialog {
		@media (--respond-to-handhelds) {
			height: 100%;
		}
	}
`;

const Layout = styled.div`
	background: white;
	display: flex;
	flex-direction: column;

	@media (--respond-to-handhelds) {
		height: 100%;
	}
`;

const ActionHeader = styled(Panels.ActionHeader)`
	flex: 0 0 auto;
`;

const TitleBar = styled(Panels.TitleBar)`
	flex: 0 0 auto;
`;

const Content = styled.div`
	flex-grow: 1;
	height: 90%;
	height: calc(100% - 40px);
	overflow: auto;
`;

//#endregion

SaveCancel.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	customHeader: PropTypes.bool,
	dialog: PropTypes.bool,
	disableSave: PropTypes.bool,
	getString: PropTypes.func,
	onCancel: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};

export default function SaveCancel({
	children,
	className,
	customHeader = false,
	dialog = true,
	disableSave,
	getString,
	onCancel,
	onSave,
}) {
	const Container = dialog ? DialogContainer : 'div';

	getString = t.override(getString);

	return (
		<Container
			className={cx('save-cancel-dialog', {
				[className + '-dialog']: className,
			})}
		>
			<Layout className={cx('save-cancel-layout', className)}>
				{!customHeader && (
					<>
						<Responsive.Item
							query={Responsive.not(Responsive.isMobile)}
							render={
								<TitleBar
									title={getString('title')}
									iconAction={onCancel}
								/>
							}
						/>
						<Responsive.Item
							query={Responsive.isMobile}
							render={
								<ActionHeader
									title={getString('title')}
									onCancel={onCancel}
									onSave={onSave}
									cancel={getString('cancel')}
									save={getString('save')}
								/>
							}
						/>
					</>
				)}

				<Content className="save-cancel-content">{children}</Content>

				<Responsive.Item
					query={Responsive.not(Responsive.isMobile)}
					render={
						<DialogButtons
							buttons={[
								{
									label: getString('cancel'),
									onClick: onCancel,
								},
								{
									label: getString('save'),
									onClick: onSave,
									disabled: disableSave,
								},
							]}
						/>
					}
				/>
			</Layout>
		</Container>
	);
}
