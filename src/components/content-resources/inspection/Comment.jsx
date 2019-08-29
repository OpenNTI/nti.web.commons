import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {buffer as buffered} from '@nti/lib-commons';

import ItemChanges from '../../../HighOrderComponents/ItemChanges';
import LabeledValue from '../../LabeledValue';

const DEFAULT_TEXT = {
	CommentPlaceholder: 'Write something',
	Comment: 'Comments'
};

const t = scoped('common.components.content-resources.inspector', DEFAULT_TEXT);

const BUFFERED_TIME = 2000;//two seconds

class Comment extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}

	attachRef = x => this.commentField = x


	onChange = buffered(BUFFERED_TIME, () => {
		//TODO: Waiting on a comment field from the server.
		// const {item} = this.props;
		// const {value: comment} = this.commentField;
		//
		// item.save({comment});
	})


	componentWillUnmount () {
		if (this.onChange.pending) {
			this.onChange.flush();
		}
	}


	render () {
		const {item} = this.props;
		const disabled = !item.isModifiable || !Object.prototype.hasOwnProperty.call(item,'comment');
		return (
			<div className="resource-viewer-inspector-file-tags">
				<LabeledValue label={t('Comment')}>
					<textarea value={item.comment}
						disabled={disabled}
						placeholder={disabled ? void 0 : t('CommentPlaceholder')}
						onChange={this.onChange}
						ref={this.attachRef}
					/>
				</LabeledValue>
			</div>
		);
	}
}

export default ItemChanges.compose(Comment);
