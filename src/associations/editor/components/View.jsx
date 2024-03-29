import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Filters } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { EmptyState } from '@nti/web-core';

import Search from '../../../components/Search';
import { Mask as Loading } from '../../../components/loading-indicators';

import Container from './Container';

const { matchesFilter } = Filters;

const DEFAULT_TEXT = {
	sharedLabel: 'Shared To',
	availableLabel: 'Available',
	noShared: {
		header: 'Not Shared Yet.',
		subHeader: 'Add to an item',
	},
	noResults: {
		header: 'No Results Found',
		subHeader: 'Try a different search',
	},
};

const t = scoped('common.components.associations.editor', DEFAULT_TEXT);

function matchesTerm(item, term) {
	const value = item.title || item.label;

	return matchesFilter(value, term);
}

function getSharedWith(associations) {
	return associations.filter(x => associations.isSharedWith(x)).flatten();
}

function getAvailable(associations) {
	return associations.filter(x => !associations.isSharedWith(x));
}

export default class AssociationsEditor extends React.Component {
	static propTypes = {
		associations: PropTypes.object.isRequired,
		filterFn: PropTypes.func,
		getString: PropTypes.func,
	};

	constructor(props) {
		super(props);

		const { associations } = this.props;

		this.sharedWith = getSharedWith(associations);
		this.available = getAvailable(associations);

		this.state = {
			sharedWith: this.sharedWith,
			available: this.available,
			isEmpty: this.sharedWith.isEmpty && this.available.isEmpty,
		};
	}

	componentDidMount() {
		const { associations } = this.props;

		associations.addListener('change', this.onAssociationsChanged);
	}

	componentWillUnmount() {
		const { associations } = this.props;

		associations.removeListener('change', this.onAssociationsChanged);
	}

	getFilterForSearch(search) {
		const { filterFn } = this.props;

		return !search
			? null
			: filterFn
			? x => filterFn(x, search)
			: x => matchesTerm(x, search);
	}

	onSearchChange = search => {
		const { sharedWith, available } = this;
		const filterFn = this.getFilterForSearch(search);
		const newSharedWith = filterFn
			? sharedWith.filter(filterFn)
			: sharedWith;
		const newAvailable = filterFn ? available.filter(filterFn) : available;

		this.setState({
			sharedWith: newSharedWith,
			available: newAvailable,
			isEmpty: newSharedWith.isEmpty && newAvailable.isEmpty,
			search,
		});
	};

	onAssociationsChanged = () => {
		const { associations } = this.props;
		const { search } = this.state;

		this.sharedWith = getSharedWith(associations);
		this.available = getAvailable(associations);

		this.onSearchChange(search);
	};

	getStrings() {
		const { associations, getString: stringOverride } = this.props;
		const { hasSharedWith } = associations;
		const getString = stringOverride ? t.override(stringOverride) : t;

		return {
			emptyHeader: getString('noResults.header'),
			emptySubHeader: getString('noResults.subHeader'),
			sharedWith: {
				label: getString('sharedLabel'),
				emptyHeader: hasSharedWith
					? getString('noResults.header')
					: getString('noShared.header'),
				emptySubHeader: hasSharedWith
					? getString('noResults.subHeader')
					: getString('noShared.subHeader'),
			},
			available: {
				label: getString('availableLabel'),
				emptyHeader: getString('noResults.header'),
				emptySubHeader: getString('noResults.subHeader'),
			},
		};
	}

	render() {
		const { associations } = this.props;
		const { sharedWith, available, isEmpty } = this.state;
		const strings = this.getStrings();

		if (associations.isLoading) {
			return (
				<div className="association-editor">
					<Loading />
				</div>
			);
		}

		return (
			<div className="association-editor">
				<Search onChange={this.onSearchChange} buffered={false} />
				{isEmpty && (
					<EmptyState
						header={strings.emptyHeader}
						subHeader={strings.emptySubHeader}
					/>
				)}
				{!isEmpty && (
					<Container
						label={strings.sharedWith.label}
						associations={sharedWith}
						emptyHeader={strings.sharedWith.emptyHeader}
						emptySubHeader={strings.sharedWith.emptySubHeader}
					/>
				)}
				{!isEmpty && (
					<Container
						label={strings.available.label}
						associations={available}
						emptyHeader={strings.available.emptyHeader}
						emptySubHeader={strings.available.emptySubHeader}
					/>
				)}
			</div>
		);
	}
}
