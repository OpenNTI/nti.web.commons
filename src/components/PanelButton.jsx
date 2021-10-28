import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { Button } from '@nti/web-core';

const t = scoped('web-commons.components.panelbutton', {
	ok: 'OK',
});
/** @typedef {(e: Event) => void} EventHandler */
/**
 *	Renders an info panel with a link/button.
 *
 * @param {object} props
 * @param {any} props.children
 * @param {string=} props.className
 * @param {JSX.Element=} props.button pass in your own button if you need special behavior or treatment
 * @param {string=} props.href the href of the button, if applicable
 * @param {EventHandler=} props.onClick click handler for the button
 * @param {string=} props.linkText the text of the button
 * @returns {JSX.Element}
 */
export default function PanelButton({
	children,
	className,
	button,
	href = '#',
	onClick,
	linkText = t('ok'),
	...rest
}) {
	const hasButton = button || (href && href !== '#') || onClick;

	return (
		<div {...rest} className={cx('panel-button', className)}>
			{children}
			{!hasButton
				? null
				: button || (
						<Button
							href={href}
							onClick={onClick}
							css={css`
								width: 100%;
								margin-top: 0.5em;
							`}
						>
							{linkText}
						</Button>
				  )}
		</div>
	);
}

7;
