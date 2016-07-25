import React from 'react';

import {scoped} from 'nti-lib-locale';

import LabeledValue from '../../LabeledValue';
import TagField from '../../TokenEditor';

const DEFAULT_TEXT = {
	TagsPlaceholder: 'Add tags like “business” or “outdoors” to enhance filters and search.',
	Tags: 'Tags'
};

const t = scoped('common.components.content-resources.inspector', DEFAULT_TEXT);

export default class Tags extends React.Component {
	static propTypes = {
		item: React.PropTypes.object
	}


	onNewTags = () => console.log(arguments)


	render () {
		const {item} = this.props;
		return (
			<div className="resource-viewer-inspector-file-tags">
				<LabeledValue label={t('Tags')}>
					<TagField value={item.tags} placeholder={t('TagsPlaceholder')} onChange={this.onNewTags}/>
				</LabeledValue>
			</div>
		);
	}
}
