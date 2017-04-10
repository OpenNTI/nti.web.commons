import React from 'react';
import PropTypes from 'prop-types';
import {wait} from 'nti-commons';
import {scoped} from 'nti-lib-locale';

import {Spinner as Loading} from '../../../../components/loading-indicators';

import Group from './Group';

const DEFAULT_TEXT = {
	label: 'Choose a Section',
	empty: 'There are no sections in this group'
};

const t = scoped('ASSOCIATIONS_CONTENT_NODE_GROUPS', DEFAULT_TEXT);

export default class ContentNodeGroups extends React.Component {
	static propTypes = {
		node: PropTypes.object,
		onAdd: PropTypes.func,
		error: PropTypes.string
	}


	constructor (props) {
		super(props);

		const {node} = this.props;

		this.state = {
			content: null
		};

		this.loadContent(node);
	}


	loadContent (node) {
		node.getContent()
			.then(wait.min(wait.SHORT))
			.then((content) => {
				this.setState({
					content
				});
			});
	}


	onAddTo = (container) => {
		const {onAdd} = this.props;
		const {content} = this.state;

		if (onAdd) {
			onAdd(container, content);
		}
	}


	render () {
		const {error} = this.props;
		const {content} = this.state;

		return (
			<div className="content-node-group">
				{error && (<h6 className="error">{error}</h6>)}
				<h6>{t('label')}</h6>
				{
					content ?
						this.renderContent(content) :
						(<Loading />)
				}
			</div>
		);
	}


	renderContent (content) {
		const {Items:items} = content;
		const hasItems = (items && items.length > 0);

		return (
			<ul className="content-node-group-items">
				{hasItems ? (
					items.map((x, index) => (
						<li key={index}><Group item={x} onAdd={this.onAddTo} /></li>
					))
				) : (
					<h6 className="error">{t('empty')}</h6>
				)}
			</ul>
		);
	}
}
