import React from 'react';
import {wait} from 'nti-commons';
import {scoped} from 'nti-lib-locale';

import Group from './Group';

import {Ellipse as Loading} from '../../../../components/loading-indicators';

const DEFAULT_TEXT = {
	label: 'Choose a Section'
};

const t = scoped('ASSOCIATIONS_CONTENT_NODE_GROUPS', DEFAULT_TEXT);

export default class ContentNodeGroups extends React.Component {
	static propTypes = {
		node: React.PropTypes.object,
		onAdd: React.PropTypes.fn,
		error: React.PropTypes.string
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

		if (onAdd) {
			onAdd(container);
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

		return (
			<ul className="content-node-group-items">
				{items.map((x, index) => {
					return (<li key={index}><Group item={x} onAdd={this.onAddTo} /></li>);
				})}
			</ul>
		);
	}
}
