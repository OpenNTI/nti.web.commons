import React, {PropTypes} from 'react';
import SelectionModel from 'nti-commons/lib/SelectionModel';
import isActionable from 'nti-commons/lib/is-event-actionable';
import getCoolOff from 'nti-commons/lib/function-cooloff';

export default class Entity extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		selection: PropTypes.instanceOf(SelectionModel)
	}

	static contextTypes = {
		onTrigger: PropTypes.func.isRequired,
		canSelectItem: PropTypes.func.isRequired,
		selectItem: PropTypes.func.isRequired
	}

	state = {}

	componentDidMount () {
		const {item} = this.props;
		item.addListener('rename', this.onBeginRename);
	}

	componentWillUnmount () {
		const {item} = this.props;
		item.removeListener('rename', this.onBeginRename);
	}

	componentDidUpdate (prevProps) {
		const {item} = this.props;
		const {item: prev} = prevProps;
		if (item !== prev) {
			prev.removeListener('rename', this.onBeginRename);
			item.addListener('rename', this.onBeginRename);
		}
	}

	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setState(this.state = {});
		}
	}


	onDragStart = (e) => {
		const {target} = e;
		const {offsetWidth: width, offsetHeight: height} = target;
		let image = target.cloneNode(true);

		this.onDragEnd();
		this.dragImage = image;

		image.removeAttribute('draggable');
		image.classList.add('ghost');
		image.style.width = width + 'px';

		document.body.appendChild(image);
		e.dataTransfer.setDragImage(image, width / 2, height / 2);
	}


	onDragEnd = () => {
		if (this.dragImage) {
			document.body.removeChild(this.dragImage);
			delete this.dragImage;
		}
	}


	canSelect = () => {
		const {canSelectItem} = this.context;
		if (!canSelectItem) { return true; }
		return canSelectItem(this.props.item);
	}


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

		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		if (this.props.item.can('rename')) {
			this.setState({rename: true});
		}
	}


	onCommitRename = (e) => {
		const {item} = this.props;
		const {target: {value}} = e;
		const newName = value.trim();

		this.setState({rename: false});

		if (newName !== item.getFileName()) {
			item.rename(newName);
		}
	}


	onSelect = (e) => {
		const {metaKey, altKey, ctrlKey, shiftKey} = e;
		const {item} = this.props;

		if (!isActionable(e)) { return; }

		if (!shiftKey) { //if shift was pressed, let this bubble up
			e.preventDefault();
			e.stopPropagation();
		}

		this.context.selectItem(item, { metaKey, altKey, ctrlKey, shiftKey });
	}


	onTrigger = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (getCoolOff(this.onTrigger)) {
			return;
		}

		const {props: {item}, context: {onTrigger}} = this;

		onTrigger(item);
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


	render () {
		return (
			<div>Your class is missing a render method, or called super.</div>
		);
	}
}
