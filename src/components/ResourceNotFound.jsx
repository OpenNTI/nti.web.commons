import React from 'react';
import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	header: 'Sorry, this page doesn\'t exist...',
	message: 'Your link may contain errors or the page may no longer exist.'
};

const t = scoped('RESOURCE_NOT_FOUND', DEFAULT_TEXT);

ResourceNotFound.propTypes = {
	actions: React.PropTypes.arrayOf(React.PropTypes.shape({
		label: React.PropTypes.string,
		handler: React.PropTypes.func
	})),
	getString: React.PropTypes.func
};
export default function ResourceNotFound ({actions = [], getString}) {
	const stringFn = getString ? t.override(getString) : t;

	return (
		<figure className="resource-not-found">
			<i className="icon-alert" />
			<figcaption>
				<h3>{stringFn('header')}</h3>
				<p>{stringFn('message')}</p>
				{actions.length && (
					<ul>
						{actions.map((x, i) => {
							return (
								<li key={i} onClick={x.handler}>{x.label}</li>
							);
						})}
					</ul>
				)}
			</figcaption>
		</figure>
	);
}
