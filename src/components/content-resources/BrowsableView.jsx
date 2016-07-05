import React, {PropTypes} from 'react';
import {getService} from 'nti-web-client';
import Logger from 'nti-util-logger';

import TaskQueue from './tasks/Queue';
import MoveTask from './tasks/Move';

import ObjectSelectionModel from 'nti-commons/lib/ObjectSelectionModel';

const logger = Logger.get('common:components:content-resources:BrowsableView');

const isFile = x => x && /nextthought.+(folder|file)/i.test(x.MimeType);

export default class BrowsableView extends React.Component {
	static propTypes = {
		accept: PropTypes.func,
		onSelectionChange: PropTypes.func,
		onTrigger: PropTypes.func,
		sourceID: PropTypes.string
	}


	static childContextTypes = {
		canSelectItem: PropTypes.func,
		onTrigger: PropTypes.func,
		onFolderDrop: PropTypes.func,
		selectItem: PropTypes.func
	}


	getChildContext = () => ({
		canSelectItem: this.canSelectItem,
		onTrigger: this.onTrigger,
		onFolderDrop: this.onFolderDrop,
		selectItem: this.selectItem
	})


	constructor (props) {
		super(props);
		this.selection = new ObjectSelectionModel();
		this.taskQueue = new TaskQueue();
		this.state = {};

		this.selection.addListener('change', this.onSelectionChange);
		this.taskQueue.addListener('begin', this.onTasksEnqueued);
		this.taskQueue.addListener('finish', this.onTasksComplete);
	}


	componentDidMount () {
		this.setup();
	}


	componentWillReceiveProps (nextProps) {
		const {sourceID} = this.props;
		if (sourceID !== nextProps.sourceID) {
			this.setup(nextProps);
		}
	}


	componentWillUnmount () {
		this.selection.removeListener('change', this.onSelectionChange);
		this.taskQueue.removeListener('begin', this.onTasksEnqueued);
		this.taskQueue.removeListener('finish', this.onTasksComplete);
	}


	canSelectItem = (item) => {
		const {accept} = this.props;
		if (!accept || typeof accept !== 'function') {
			return true;
		}

		return accept(item);
	}


	dropItem = (item) => (
		item = item && (item.getID ? item.getID() : item.NTIID),
		new Promise(next =>
			this.setState({folderContents: this.state.folderContents.filter(i => i.getID() !== item)}, next))
	)


	gotoParent = () => {
		const {folder} = this.state;
		const parent = folder && folder.getParentFolder();
		if (parent) {
			this.setFolder(parent);
		}
	}


	refresh = () => this.setFolder(this.state.folder, this.state.folderContents)


	selectItem = (item, modifiers) => {
		const {selection} = this;
		const {metaKey, ctrlKey/*, altKey, shiftKey*/} = modifiers || {};

		if (!this.canSelectItem(item)) {
			return;
		}

		if (selection.isSelected(item)) {
			if (metaKey || ctrlKey) {
				selection.remove(item);
			}
			return;
		}

		if (metaKey || ctrlKey) {
			selection.add(item);
		}
		else {
			selection.set(item);
		}
	}


	setFolder = (folder, contents) => {
		this.setState({folder, folderContents: contents});
		this.selection.set([]);

		folder.getContents()
			.then(c => this.setState({folderContents: c, error: null}))
			.catch(error => this.setState({error}));
	}


	setup (props = this.props) {
		const {sourceID} = props;

		getService()
			.then(s => s.getObject(sourceID))
			.then(c => c.getResources())
			.then(folder => this.setFolder(folder))
			.catch(error => this.setState({error}));
	}


	moveEntities = (entities, target) => {
		this.selection.set();

		for (let item of entities) {
			this.taskQueue.add(new MoveTask(item, target.getPath(), () => this.dropItem(item)));
		}
	}


	onFolderDrop = (target, data, files) => {

		if (files && files.lenth) {
			this.uploadFiles(files, target);
		}
		else if (data && Array.isArray(data) && data.every(isFile)) {
			this.moveEntities(data, target);
		}

		logger.log('Drop: %s %o %o', target.path, data, files);
	}


	onSelectionChange = () => {
		const {onSelectionChange} = this.props;
		this.forceUpdate();

		if (onSelectionChange) {
			const selections = Array.from(this.selection);
			onSelectionChange(selections);
		}
	}


	onTasksComplete = () => {}


	onTasksEnqueued = () => {}


	onTrigger = (item) => {
		const {onTrigger} = this.props;

		if(onTrigger && onTrigger(item)) {
			return;
		}

		if (item.isFolder) {
			return this.setFolder(item);
		}

		logger.debug('Selected File: %o', item);
	}



	render () {
		return (
			<div>Your class is missing a render method, or called super.</div>
		);
	}
}
