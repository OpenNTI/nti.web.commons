import './SharedWith.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import LabeledValue from '../../LabeledValue';
import { Ellipse as Loading } from '../../loading-indicators';

import Link from './SharedLink';

const DEFAULT_TEXT = {
	NoAssociations: 'Not shared',
	replace: 'Replace Shared Image',
	SharedWith: 'Shared With',
};

const t = scoped('common.components.content-resources.inspector', DEFAULT_TEXT);

function getOutlineAndUnitsFromPath(path) {
	const course = path.find(i => i.getOutlineNode);
	//"application/vnd.nextthought.courses.courseoutlinecontentnode"
	const o = path.find(i => /outline.+node/i.test(i.MimeType));
	const outlineNodeId = o && o.getContentId();

	return !course
		? { outlineNode: o }
		: course
				.getOutlineNode(outlineNodeId, { unpublished: true })
				.then(outlineNode => {
					const unit = outlineNode.parent();
					return { course, unit, outlineNode };
				});
}

export default class SharedWith extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
	};

	state = {};

	componentDidMount() {
		this.load();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.item !== this.props.item) {
			this.load();
		}
	}

	load(props = this.props) {
		const { item } = props;
		const getPathFrom = o => o.getContextPath().then(([first]) => first); //unwrap, take the first path

		this.setState(
			{ error: null, links: null },
			() =>
				item &&
				item
					.fetchLinkParsed('associations')
					.then(x => Promise.all(x.map(o => getPathFrom(o))))
					.then(x =>
						Promise.all(x.map(o => getOutlineAndUnitsFromPath(o)))
					)
					.then(x => this.setState({ links: x }))
					.catch(error => this.setState({ links: [], error }))
		);
	}

	onReplace = () => {};

	render() {
		const {
			props: { item },
			state: { error, links },
		} = this;
		if (!item) {
			return null;
		}

		return (
			<div className="resource-viewer-inspector-file-shared-with">
				{!links ? (
					<Loading />
				) : (
					<LabeledValue label={t('SharedWith')}>
						{error
							? this.renderError(error)
							: this.renderLinks(links)}
						{!error && links.length > 0 && (
							<button
								className="replace"
								onClick={this.onReplace}
							>
								{t('replace')}
							</button>
						)}
					</LabeledValue>
				)}
			</div>
		);
	}

	renderError(error) {
		return (
			<error>
				There was a problem loading references.
				<stack>{error.stack || error.message || error}</stack>
			</error>
		);
	}

	renderLinks(links) {
		if (!links) {
			return null;
		}
		if (!Array.isArray(links)) {
			links = [links];
		}

		return (
			<div>
				{links.map((link, i) => (
					<Link {...link} key={i} />
				))}
				{links.length === 0 && (
					<span className="empty">{t('NoAssociations')}</span>
				)}
			</div>
		);
	}
}
