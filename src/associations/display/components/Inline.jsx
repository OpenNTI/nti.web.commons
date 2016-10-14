import React from 'react';
import {scoped} from 'nti-lib-locale';

import {List, Loading} from '../../../components';

const DEFAULT_TEXT = {
	loading: {
		one: 'Shared with %(count)s item',
		other: 'Shared with %(count)s items'
	},
	empty: 'Add to Item'
};

const t = scoped('ASSOCIATIONS_INLINE_DISPLAY', DEFAULT_TEXT);

export default class InlineAssociations extends React.Component {
	static propTypes = {
		item: React.PropTypes.shape({
			associationCount: React.PropTypes.number,
			getAssociations: React.PropTypes.func
		}).isRequired,
		scope: React.PropTypes.object,
		getString: React.PropTypes.func
	}


	constructor (props) {
		super(props);

		this.state = {
			loading: true
		};

		this.loadAssociations(props.item);
	}


	componentDidMount () {
		const {item, scope} = this.props;

		this.loadAssociations(item, scope);
	}


	loadAssociations (item, scope) {
		this.setState({
			loading: true
		});

		item.getAssociations(scope)
			.then((associations) => {
				this.setState({
					loading: false,
					associations
				});
			});
	}


	getStringFn () {
		const {getString} = this.props;

		return getString ? t.override(getString) : t;
	}


	render () {
		const {item} = this.props;
		const {loading} = this.state;
		const {associationCount} = item;

		if (associationCount === 0 ) {
			return (
				<div className="inline-association">
					{this.renderEmpty()}
				</div>
			);
		}

		return (
			<div className="inline-association" onClick={this.onClick}>
				{loading && <Loading.Spinner grey size="20px" />}
				{loading && this.renderLoading()}
				{!loading && this.renderAssociations()}
			</div>
		);
	}


	renderEmpty () {
		const getString = this.getStringFn();

		return getString('empty');
	}


	renderLoading () {
		const {item} = this.props;
		const getString = this.getStringFn();
		const count = item.associationCount;

		return (
			<span className="loading-text">{getString('loading', {count})}</span>
		);
	}


	renderAssociations () {
		const {associations} = this.state;
		const getString = this.getStringFn();

		return (
			<List.Inline children={associations.map(x => x.title || x.label)} max={1} getString={getString} />
		);
	}
}
