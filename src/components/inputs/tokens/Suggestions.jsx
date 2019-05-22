import React from 'react';
import PropTypes from 'prop-types';

import {cleanTokens} from './utils';

const LOADING = 'loading';


export default class TokenSuggestions extends React.Component {
	static propTypes = {
		selected: PropTypes.array,
		match: PropTypes.string,
		label: PropTypes.string,
		getSuggestions: PropTypes.func,
		explicitAdd: PropTypes.bool,
		addToken: PropTypes.func
	}

	state = {suggestions: null}

	componentDidMount () {
		this.setup(this.props);
	}


	componentDidUpdate (prevProps) {
		const {match} = this.props;
		const {match:oldMatch} = prevProps;

		if (match !== oldMatch) {
			this.setup();
		}
	}


	async setup (props = this.props) {
		const {match, getSuggestions} = this.props;

		if (!getSuggestions) {
			this.setState({suggestions: null});
			return;
		}

		const loadingTimeout = setTimeout(() => {
			this.setState({suggestions: LOADING});
		}, 100);

		try {
			const suggestions = await getSuggestions(match);

			clearTimeout(loadingTimeout);

			this.setState({
				suggestions: cleanTokens(suggestions)
			});
		} catch (e) {
			this.setState({
				error: e,
				suggestions: null
			});
		}
	}

	render () {
		const {explicitAdd} = this.props;
		const {suggestions} = this.state;

		return (
			<div>
				{explicitAdd && suggestions !== LOADING && this.renderCreate()}
				{this.renderSuggestions()}
			</div>
		);
	}


	renderCreate () {

	}


	renderSuggestions () {
		const {selected} = this.props;
		const {suggestions, error} = this.state;
		const selectedMap = (selected || []).reduce((acc, select) => ({...acc, [select.value]: true}), {});

		if (error) {
			return this.renderError(error);
		}

		if (!suggestions) { return null; }

		return (
			<ul>
				{suggestions.map((suggestion, index) => {
					return (
						<li key={index}>
							{suggestion.display}
						</li>
					);
				})}
			</ul>
		);
	}
}
