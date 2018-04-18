import React from 'react';
import PropTypes from 'prop-types';
import t from '@nti/lib-locale';

export default class extends React.Component {
	static displayName = 'LocalizedHTML';

	static propTypes = {
		stringId: PropTypes.string.isRequired,

		tag: PropTypes.string,

		className: PropTypes.string
	};

	static defaultProps = { tag: 'div' };

	render () {
		let Tag = this.props.tag;

		return (
			<Tag {...this.props} dangerouslySetInnerHTML={{__html: t(this.props.stringId, this.props)}} />
		);
	}
}
