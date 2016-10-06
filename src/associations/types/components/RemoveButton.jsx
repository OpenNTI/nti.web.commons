import React from 'react';
import {scoped} from 'nti-lib-locale';

import {areYouSure} from '../../../prompts';

const DEFAULT_TEXT = {
	tryAgain: 'Try Again',
	confirmRemoveMessage: 'You are about to remove this item. You must manually add it back to undo this action.'
};

const t = scoped('ASSOCIATION_REMOVE_BUTTON', DEFAULT_TEXT);

export default class AssociationRemove extends React.Component {
	static propTypes = {
		onRemove: React.PropTypes.func,
		error: React.PropTypes.string,
		getString: React.PropTypes.func
	}


	getStringFn () {
		const {getString} = this.props;

		return getString ? t.override(getString) : t;
	}


	onClick () {
		const {onRemove} = this.props;
		const getString = this.getStringFn();

		areYouSure(getString('confirmRemoveMessage'))
			.then(() => {
				if (onRemove) {
					onRemove();
				}
			});
	}


	render () {
		const {error} = this.props;
		const getString = this.getStringFn();

		return (
			<div className="association-remove-button" onClick={this.onClick}>
				{!error ?
					(<i className="icon-remove" />) :
					(<span className="try-again">{getString('tryAgain')}</span>)
				}
			</div>
		);
	}
}
