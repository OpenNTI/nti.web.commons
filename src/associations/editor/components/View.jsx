import React from 'react';
import matchesFilter from 'nti-commons/lib/matches-filter';
import {scoped} from 'nti-lib-locale';

import Container from './Container';

import EmptyState from '../../../components/EmptyState';
import Search from '../../../components/Search';

const DEFAULT_TEXT = {
	sharedLabel: 'Shared To',
	availableLabel: 'Available',
	noShared: {
		header: 'Not Shared Yet.',
		subHeader: 'Add to an item'
	},
	noResults: {
		header: 'No Results Found',
		subHeader: 'Try a different search'
	}
};

const t = scoped('ASSOCIATIONS_EDITOR', DEFAULT_TEXT);


function matchesTerm (item, term) {
	const value = item.title || item.label;

	return matchesFilter(value, term);
}


export default class AssociationsEditor extends React.Component {
	static propTypes = {
		associations: React.PropTypes.object.isRequired,
		filterFn: React.PropTypes.func,
		getString: React.PropTypes.func
	}


	constructor (props) {
		super(props);

		const {associations} = this.props;

		this.state = {
			sharedWith: associations.sharedWith,
			available: associations.available,
			isEmpty: associations.isEmpty
		};
	}


	onSearchChange = (value) => {
		const {associations, filterFn:customFilter} = this.props;
		const filterFn = (x) => {
			return customFilter ? customFilter(x, value) : matchesTerm(x, value);
		};

		const filtered = associations.filter(filterFn);

		this.setState({
			sharedWith: filtered.sharedWith,
			available: filtered.available,
			isEmpty: filtered.isEmpty
		});
	}


	getStrings () {
		const {associations, getString:stringOverride} = this.props;
		const {hasAssociations} = associations;
		const getString = stringOverride ? t.override(stringOverride) : t;

		return {
			sharedWith: {
				label: getString('sharedLabel'),
				emptyHeader: hasAssociations ? getString('noResults.header') : getString('noShared.header'),
				emptySubHeader: hasAssociations ? getString('noResults.subHeader') : getString('noShared.subHeader')
			},
			available: {
				label: getString('availableLabel'),
				emptyHeader: getString('noResults.header'),
				emptySubHeader: getString('noResults.subHeader')
			}
		};
	}


	render () {
		const {associations} = this.props;
		const {sharedWith, available, isEmpty} = this.state;
		const strings = this.getStrings();

		return (
			<div className="association-editor">
				<Search onChange={this.onSearchChange} buffered={false} />
				{isEmpty && (
					<EmptyState
						header={strings.available.emptyHeader}
						subHeader={strings.available.emptySubHeader}
					/>
				)}
				{!isEmpty && (
					<Container
						groups={[sharedWith]}
						label={strings.sharedWith.label}
						associations={associations}
						emptyHeader={strings.sharedWith.emptyHeader}
						emptySubHeader={strings.sharedWith.emptySubHeader}
					/>
				)}
				{!isEmpty && (
					<Container
						groups={available}
						label={strings.available.label}
						associations={associations}
						emptyHeader={strings.available.emptyHeader}
						emptySubHeader={strings.available.emptySubHeader}
					/>
				)}
			</div>
		);
	}
}
