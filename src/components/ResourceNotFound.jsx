import './ResourceNotFound.scss';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { getConfig } from '@nti/web-client';

const DEFAULT_TEXT = {
	header: "Sorry, this page doesn't exist...",
	message: 'Your link may contain errors or the page may no longer exist.',
	back: 'Back',
	home: 'Return Home',
};

const t = scoped('common.components.resource-not-found', DEFAULT_TEXT);

const HomeLink = styled('a').attrs(props => ({
	href: getConfig('basepath') ?? '/',
	...props,
}))`
	display: block;
	font: normal 400 0.875rem/1 var(--body-font-family);
	color: var(--text-color-nav-link);
	margin: 1rem 0;
`;

ResourceNotFound.getBackAction = history => ({
	label: t('back'),
	handler: () => history?.goBack?.(),
});
ResourceNotFound.propTypes = {
	actions: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			handler: PropTypes.func,
		})
	),
	getString: PropTypes.func,
};
export default function ResourceNotFound({ actions = [], getString }) {
	const stringFn = getString ? t.override(getString) : t;

	return (
		<figure className="resource-not-found">
			<i className="icon-alert" />
			<figcaption>
				<h3>{stringFn('header')}</h3>
				<p>{stringFn('message')}</p>
				{actions.length ? (
					<ul>
						{actions.map((x, i) => {
							return (
								<li key={i} onClick={x.handler}>
									{x.label}
								</li>
							);
						})}
					</ul>
				) : (
					<HomeLink>{stringFn('home')}</HomeLink>
				)}
			</figcaption>
		</figure>
	);
}
