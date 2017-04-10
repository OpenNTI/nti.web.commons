import React from 'react';
import PropTypes from 'prop-types';

import Preview from './inspection/Preview';
import Filename from './inspection/Filename';
import TypeAndSize from './inspection/TypeAndSize';
import Field from './inspection/Field';
import SharedWith from './inspection/SharedWith';
import Tags from './inspection/Tags';
// import Comment from './inspection/Comment';

export default class Inspector extends React.Component {
	static propTypes = {
		item: PropTypes.object
	}

	state = {}

	render () {
		const {item} = this.props;

		return !item ? null : (
			<div className="resource-viewer-inspector">
				<Preview item={item}/>
				<Filename item={item}/>
				<TypeAndSize item={item}/>
				<Field item={item} field="CreatedTime"/>
				<Field item={item} field="creator"/>
				<SharedWith item={item}/>
				<Tags item={item}/>
			</div>
		);
	}
}
