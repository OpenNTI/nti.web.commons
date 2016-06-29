import React, {PropTypes} from 'react';
import SelectionModel from 'nti-commons/lib/SelectionModel';
import isActionable from 'nti-commons/lib/is-event-actionable';
import getCoolOff from 'nti-commons/lib/function-cooloff';

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
		e.preventDefault();
		e.stopPropagation();

		const {selection, item} = this.props;

		if (selection.isSelected(item)) {
			return;
		}

		selection.set(item);
	}


	onTrigger = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (getCoolOff(this.onTrigger)) {
			return;
		}

		const {item} = this.props;

		console.log('Tiggered', item);

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
