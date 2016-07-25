import React from 'react';

import {scoped} from 'nti-lib-locale';

import LabeledValue from '../../LabeledValue';

const DEFAULT_TEXT = {
	CommentPlaceholder: 'Write something',
	Comment: 'Comments'
};

const t = scoped('common.components.content-resources.inspector', DEFAULT_TEXT);

export default class Comments extends React.Component {
	static propTypes = {
		item: React.PropTypes.object
	}

	state = {}

	render () {
		const {item} = this.props;
		return (
			<div className="resource-viewer-inspector-file-tags">
				<LabeledValue label={t('Comment')}>
					<textarea value={item.comment} placeholder={t('CommentPlaceholder')}/>
				</LabeledValue>
			</div>
		);
	}
}
