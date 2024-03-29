import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

import Dialog from '../Dialog';
import { Responsive } from '../../layouts';
import DialogButtons from '../../components/DialogButtons';
import * as Panels from '../../components/panels';

//#region 🎨 & 🛠️

const { isMobile, isMobileContext, not, any } = Responsive;

const MOBILE = any(isMobileContext, isMobile);

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

const Layout = styled('div').attrs(({ onDismiss, ...props }) => props)`
	background: white;
	display: flex;
	flex-direction: column;

	@media (--respond-to-handhelds) {
		height: 100%;
	}

	:global(.dialog-buttons) {
		[icon] {
			display: none;
			vertical-align: inherit;

			& + [icon-label] {
				display: inline;
			}
		}

		:global(.primary) {
			[icon] {
				display: initial;
				margin-right: 0.5em;
			}
		}
	}
`;

const TitleBar = styled(Panels.TitleBar)`
	flex: 0 0 auto;
	align-items: center;
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
	title: PropTypes.oneOfType([PropTypes.oneOf([false]), PropTypes.node]),
	controls: PropTypes.bool,
	dialog: PropTypes.bool,
	disableSave: PropTypes.bool,
	getString: PropTypes.func,
	onCancel: PropTypes.func.isRequired,
	onSave: PropTypes.func.isRequired,
};

export default function SaveCancel({
	children,
	className,
	title = false,
	dialog = true,
	controls = true,
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
				<>
					<Responsive.Item
						query={not(MOBILE)}
						render={
							<TitleBar
								title={title || getString('title')}
								iconAction={onCancel}
							/>
						}
					/>
					<Responsive.Item
						query={MOBILE}
						render={
							<Panels.ActionHeader
								title={title || getString('title')}
								onCancel={onCancel}
								onSave={controls && onSave}
								cancel={getString('cancel')}
								save={getString('save')}
							/>
						}
					/>
				</>

				<Content className="save-cancel-content">{children}</Content>

				{controls && (
					<Responsive.Item
						query={not(MOBILE)}
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
				)}
			</Layout>
		</Container>
	);
}
