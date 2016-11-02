import React from 'react';
import {scoped} from 'nti-lib-locale';

import {List, Loading, Flyout} from '../../../components';

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
		onShow: React.PropTypes.func,
		getString: React.PropTypes.func
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
		let {associationCount} = item;

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
		const getString = this.getStringFn();
		const children = associations.map(x => x.title || x.label);

		const trigger = (
			<List.Inline children={children} max={1} getString={getString} />
		);

		return (
			<Flyout arrow hover trigger={trigger} dark>
				<List.Limited className="inline-association-list" onShowMore={this.showMore} children={children} max={3} getString={getString} />
			</Flyout>
		);
	}
}
