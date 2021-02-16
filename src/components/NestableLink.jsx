import React from 'react';

/*
 * Anchor tags cannot be nested within other anchor tags... this works around that.
 *
 */
export default class NestableLink extends React.Component {
	attachRef = x => (this.link = x);

	onClick = e => {
		e.preventDefault();
		e.stopPropagation();
		const { link } = this;
		const href = link.getAttribute('href');
		const target = link.getAttribute('target');

		if (target) {
			window.open(href, target);
			return;
		}

		Object.assign(global.location, { href });
	};

	render() {
		return (
			<span ref={this.attachRef} {...this.props} onClick={this.onClick} />
		);
	}
}
