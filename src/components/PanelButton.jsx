import React from 'react';
import PropTypes from 'prop-types';
import t from 'nti-lib-locale';


/**
 *	Renders an info panel with a link/button.
 */
export default React.createClass({
	displayName: 'PanelButton',

	propTypes: {
		linkText: PropTypes.string, // the text of the button
		href: PropTypes.string, // the href of the button, if applicable
		onClick: PropTypes.func, // click handler for the button
		button: PropTypes.element, // pass in your own button if you need special behavior or treatment

		children: PropTypes.any
	},

	getDefaultProps () {
		return {
			linkText: t('BUTTONS.ok'),
			href: '#'
		};
	},


	render () {
		const {children, button, href, onClick, linkText, ...rest} = this.props;

		function renderButton () {

			if (!button && (!href || href === '#') && !onClick) {
				return null;
			}

			return button || <a {...{
				href,
				onClick: onClick,
				className: 'button tiny column',
				children: linkText
			}}/>;
		}

		return (
			<div {...rest}>
				<div className="panel-button">
					{children}
					{renderButton()}
				</div>
			</div>
		);
	}

});
