import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Triggered } from '../../prompts';

import Single from './Single';
import Multiple from './Multiple';

const styles = stylesheet`
	:global(.modal) .light-box-dialog {
		display: flex !important;

		& :global(dialog.modal-content) {
			width: auto;
		}
	}
`;

ImageLightBox.propTypes = {
	trigger: PropTypes.any,
	children: PropTypes.any,
};
export default function ImageLightBox({ trigger, children, ...otherProps }) {
	const Cmp = React.Children.count(children) > 1 ? Multiple : Single;

	return (
		<Triggered
			trigger={trigger}
			className={cx(styles.lightBoxDialog, 'nti-lightbox-dialog')}
		>
			<Cmp {...otherProps}>{children}</Cmp>
		</Triggered>
	);
}
