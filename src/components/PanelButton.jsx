import React from 'react';
import t from 'nti-lib-locale';


/**
 *	Renders an info panel with a link/button.
 */
export default React.createClass({
	displayName: 'PanelButton',

	propTypes: {
		linkText: React.PropTypes.string, // the text of the button
		href: React.PropTypes.string, // the href of the button, if applicable
		buttonClick: function deprecated (o, k) { if (o[k]) { return new Error('Deprecated, use "onClick"'); } },
		onClick: React.PropTypes.func, // click handler for the button
		button: React.PropTypes.element, // pass in your own button if you need special behavior or treatment

		children: React.PropTypes.any
	},

	getDefaultProps () {
		return {
			linkText: t('BUTTONS.ok'),
			href: '#'
		};
	},


	render () {
		const {children, button, href, buttonClick, onClick, linkText, ...rest} = this.props;

		function renderButton () {

			if (!button && (!href || href === '#') && !onClick && !buttonClick) {
				return null;
			}

			return button || <a {...{
				href,
				onClick: onClick || buttonClick,
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
