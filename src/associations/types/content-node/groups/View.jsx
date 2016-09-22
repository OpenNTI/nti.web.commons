import React from 'react';
import minWait, {SHORT} from 'nti-commons/lib/wait-min';
import {scoped} from 'nti-lib-locale';

import Group from './Group';

import Loading from '../../../../components/TinyLoader';

const DEFAULT_TEXT = {
	label: 'Choose a Section'
};

const t = scoped('ASSOCIATIONS_CONTENT_NODE_GROUPS', DEFAULT_TEXT);

export default class ContentNodeGroups extends React.Component {
	static propTypes = {
		node: React.PropTypes.object,
		onAdd: React.PropTypes.fn
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
			.then(minWait(SHORT))
			.then((content) => {
				this.setState({
					content
				});
			});
	}


	onAddTo = (container) => {
		const {onAdd} = this.props;

		if (onAdd) {
			onAdd(container);
		}
	}


	render () {
		const {content} = this.state;

		return (
			<div className="content-node-group">
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

		return (
			<ul className="content-node-group-items">
				{items.map((x, index) => {
					return (<li key={index}><Group item={x} onAdd={this.onAddTo} /></li>);
				})}
			</ul>
		);
	}
}
