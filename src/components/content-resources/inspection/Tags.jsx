import React from 'react';

import {scoped} from 'nti-lib-locale';
import buffered from 'nti-commons/lib/function-buffer';

import ItemChanges from '../../../HighOrderComponents/ItemChanges';

import LabeledValue from '../../LabeledValue';
import TagField from '../../TokenEditor';

const DEFAULT_TEXT = {
	TagsPlaceholder: 'Add tags like “business” or “outdoors” to enhance filters and search.',
	Tags: 'Tags'
};

const t = scoped('common.components.content-resources.inspector', DEFAULT_TEXT);

const BUFFERED_TIME = 2000;//two seconds

class Tags extends React.Component {
	static propTypes = {
		item: React.PropTypes.object
	}

	attachRef = x => this.tagField = x


	onChange = buffered(BUFFERED_TIME, () => {
		const {item} = this.props;
		const {value: tags} = this.tagField;

		item.save({tags});
	})


	componentWillUnmount () {
		if (this.onChange.pending) {
			this.onChange.flush();
		}
	}


	render () {
		const {item} = this.props;

		return (
			<div className="resource-viewer-inspector-file-tags">
				<LabeledValue label={t('Tags')}>
					<TagField value={item.tags}
						disabled={!item.hasLink('edit')}
						placeholder={t('TagsPlaceholder')}
						onChange={this.onChange}
						ref={this.attachRef}
						/>
				</LabeledValue>
			</div>
		);
	}
}

export default ItemChanges.compose(Tags);
