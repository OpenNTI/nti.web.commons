import React, {PropTypes} from 'react';
import SelectionModel from 'nti-commons/lib/SelectionModel';
import isActionable from 'nti-commons/lib/is-event-actionable';

export default class Entity extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		selection: PropTypes.instanceOf(SelectionModel)
	}

	state = {}

	attachInputRef = (ref) => {
		if (ref) {
			ref.focus();
			// ref.select(); <- doesn't work on all browser *caugh* safari *caugh*
			ref.setSelectionRange(0, ref.value.length);
		}
	}

	onBeginRename = (e) => {
		const {selection, item} = this.props;
		if (!selection.isSelected(item)) { return; }

		e.preventDefault();
		e.stopPropagation();
		if (this.props.item.can('rename')) {
			this.setState({rename: true});
		}
	}


	onCommitRename = (e) => {
		const {target: {value}} = e;
		this.setState({rename: false});
		console.log('rename: ' + value);
	}


	onSelect = (e) => {
		if (!isActionable(e)) { return; }
		const {selection, item} = this.props;
		selection.set(item);
	}


	onFilenameKeyDown = (e) => {
		e.stopPropagation();
		const {key} = e;
		if (key === 'Enter') {
			e.target.blur();
		} else if (key === 'Escape') {
			this.setState({rename: false});
		}
	}


	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setState(this.state = {});
		}
	}


	render () {
		return (
			<div>Your class is missing a render method, or called super.</div>
		);
	}
}
