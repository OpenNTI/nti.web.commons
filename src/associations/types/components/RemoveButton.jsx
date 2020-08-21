import './RemoveButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import {areYouSure} from '../../../prompts';

const DEFAULT_TEXT = {
	tryAgain: 'Try Again',
	confirmRemoveMessage: 'You are about to remove this item. You must manually add it back to undo this action.'
};

const t = scoped('common.components.associations.buttons.remove', DEFAULT_TEXT);

export default class AssociationRemove extends React.Component {
	static propTypes = {
		onRemove: PropTypes.func,
		error: PropTypes.bool,
		getString: PropTypes.func,
		disabled: PropTypes.bool
	}


	getStringFn () {
		const {getString} = this.props;

		return getString ? t.override(getString) : t;
	}


	onClick = () => {
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
		const {error, disabled} = this.props;
		const getString = this.getStringFn();
		const cls = cx('association-remove-button', {disabled});

		return (
			<div className={cls} onClick={this.onClick}>
				{!error ?
					(<i className="icon-remove" />) :
					(<span className="try-again">{getString('tryAgain')}</span>)
				}
			</div>
		);
	}
}
