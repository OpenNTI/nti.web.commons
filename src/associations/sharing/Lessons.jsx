import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';

import {Inline} from '../display';
import {openEditorModal} from '../editor';
import {createGroupedInterfaceForItem} from '../interface';

const DEFAULT_TEXT = {
	empty: 'Add to Lesson',
	loading: {
		one: 'Shared with %(count)s Lesson...',
		other: 'Shared with %(count)s Lessons...'
	},
	modalLabel: 'Add to Lesson',
	availableLabel: 'Available Lessons',
	noShared: {
		subHeader: 'Add to a Lesson.'
	},
	remaining: {
		one: '%(count)s Other Lesson',
		other: '%(count)s Other Lessons'
	},
	label: {
		//This makes use of the pluralization of the count of list items to get the appropriate commas or not
		remaining: {
			one: 'Shared with {list} and {remaining}',
			other: 'Shared with {list}, and {remaining}'
		},
		single: 'Shared with {list}'
	},
};

const t = scoped('Lessons', DEFAULT_TEXT);

export default class Lessons extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		scope: PropTypes.object
	}


	onClick = () => {
		const {item, scope} = this.props;
		const associations = createGroupedInterfaceForItem(item, scope);

		openEditorModal(t('modalLabel'), associations, null, t, () => {
			this.forceUpdate();
		});
	}


	render () {
		const {item, scope} = this.props;
		const count = item.LessonContainerCount;
		const cls = cx('item-sharing', {single: count === 1, none: count === 0});

		return item && item.hasLink('Lessons') ?
					(
						<div className={cls} onClick={this.onClick}>
							<i className="icon-folder" />
							<Inline item={item} scope={scope} getString={t} onShow={this.onClick} />
						</div>
					) :
					null;
	}
}
