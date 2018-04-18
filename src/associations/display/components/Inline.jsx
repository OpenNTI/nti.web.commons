import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

import * as Flyout from '../../../flyout';
import {List, Loading} from '../../../components';

const DEFAULT_TEXT = {
	loading: {
		one: 'Shared with %(count)s item',
		other: 'Shared with %(count)s items'
	},
	empty: 'Add to Item'
};

const t = scoped('common.components.associations.inline', DEFAULT_TEXT);

export default class InlineAssociations extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			associationCount: PropTypes.number,
			getAssociations: PropTypes.func
		}).isRequired,
		scope: PropTypes.object,
		onShow: PropTypes.func,
		getString: PropTypes.func
	}


	constructor (props) {
		super(props);

		this.state = {
			loading: true
		};
	}


	componentDidMount () {
		const {item, scope} = this.props;

		this.loadAssociations(item, scope);
	}


	componentWillReceiveProps (nextProps) {
		const {item, scope} = nextProps;

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
			})
			.catch(() => {
				this.setState({
					loading: false,
					associations: []
				});
			});
	}


	getStringFn () {
		const {getString} = this.props;

		return getString ? t.override(getString) : t;
	}



	showMore = () => {
		const {onShow} = this.props;

		if (onShow) {
			onShow();
		}
	}


	render () {
		const {item} = this.props;
		const {loading} = this.state;
		const {associations} = this.state;
		let {associationCount = 0} = item;

		if (associations && associations.length !== associationCount) {
			associationCount = associations.length;
		}

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

		const props = {
			children: associations.map(x => x.title || x.label),
			getString: this.getStringFn(),
			max: 1
		};

		const trigger = (
			<List.LimitedInline {...props} />
		);

		return (
			<Flyout.Triggered arrow hover trigger={trigger} dark>
				<List.Limited {...props} className="inline-association-list" onShowMore={this.showMore} max={3} />
			</Flyout.Triggered>
		);
	}
}
