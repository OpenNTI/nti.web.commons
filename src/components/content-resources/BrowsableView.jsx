import React, {PropTypes} from 'react';
import {getService} from 'nti-web-client';
import {scoped} from 'nti-lib-locale';
import Logger from 'nti-util-logger';

import {alert} from '../../prompts';

import TaskQueue from './tasks/Queue';
import MoveTask from './tasks/Move';
import UploadTask from './tasks/Upload';

import ObjectSelectionModel from 'nti-commons/lib/ObjectSelectionModel';

const logger = Logger.get('common:components:content-resources:BrowsableView');

const ONE_MINUTE = 60000;//60 * 1000ms

const isFile = x => x && /nextthought.+(folder|file)/i.test(x.MimeType);

const DEFAULT_TEXT = {
	ACTIVE: {
		move: 'Moving %(filename)s...',
		upload: 'Uploading %(filename)s...'
	},
	COMPLETE: {
		unknown: 'Something went wrong.',
		PermissionDeniedNoLink: 'Permission Denied.',
		movefail: {
			zero: 'Could not move %(filename)s. %(message)s',
			one: 'Failed to move %(filename)s, and %(count)s other.',
			other: 'Failed to move %(filename)s, and %(count)s others.'
		},
		uploadfail: {
			zero: 'Could not upload %(filename)s. %(message)s',
			one: 'Failed to upload %(filename)s, and %(count)s other.',
			other: 'Failed to upload %(filename)s, and %(count)s others.'
		},
		move: {
			zero: 'Moved %(filename)s.',
			one: 'Moved %(filename)s, and %(count)s other.',
			other: 'Moved %(filename)s, and %(count)s others.'
		},
		upload: {
			zero: 'Uploaded %(filename)s.',
			one: 'Uploaded %(filename)s, and %(count)s other.',
			other: 'Uploaded %(filename)s, and %(count)s others.'
		}
	}
};

const t = scoped('CONTENT_RESOURCES', DEFAULT_TEXT);

export default class BrowsableView extends React.Component {
	static propTypes = {
		accept: PropTypes.func,
		onSelectionChange: PropTypes.func,
		onTrigger: PropTypes.func,
		sourceID: PropTypes.string,
		limited: PropTypes.bool
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
		onFolderDrop: this.props.limited ? void 0 : this.onFolderDrop,
		selectItem: this.selectItem
	})


	constructor (props) {
		super(props);
		this.selection = new ObjectSelectionModel();
		this.taskQueue = new TaskQueue();
		this.state = {};

		this.selection.addListener('change', this.onSelectionChange);
		this.taskQueue.addListener('begin', this.onTasksEnqueued);
		this.taskQueue.addListener('progress', this.onTaskProgress);
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
		this.taskQueue.removeListener('progress', this.onTaskProgress);
		this.taskQueue.removeListener('finish', this.onTasksComplete);
	}


	canSelectItem = (item) => {
		const {accept} = this.props;
		if (!accept || typeof accept !== 'function') {
			return true;
		}

		return item.isFolder || accept(item);
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


	refresh = () => this.setFolder(this.state.folder, this.state.folderContents, false)


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


	setFolder = (folder, contents, clearProgress = true) => {
		const additional = clearProgress ? {progress: void 0} : {};
		this.setState(
			{folder, folderContents: contents, ...additional},
			() => this.onSelectionChange());
		this.selection.set([]);

		return folder.getContents()
			.then(c => (this.setState({folderContents: c, error: null}), c))
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


	uploadFiles = (files, folder) => {
		const add = (o) => {
			let {folderContents = []} = this.state;
			if (!folderContents.find(x => o.getID() === x.getID())) {
				folderContents = [...folderContents, o];
				this.selection.add(o);
				this.setState({folderContents});
			}
		};

		const largestLast = (a, b) => a.size - b.size;

		Promise.all(
			Array.from(files)
				.sort(largestLast)
				.map(item => new Promise(done =>
					this.taskQueue.add(new UploadTask(item, folder, (o)=> {add(o);done();} ))
					)
				)
			)

			.then(() => {

				if (this.state.folder === folder) {
					const ids = Array.from(this.selection).map(x => x.getID());
					this.refresh()
						.then(items => {
							if (items) {
								this.selection.add(
									...items.filter(x => ids.includes(x.getID()))
								);
							}
						});
				}

			});

	}


	onFolderDrop = (target, data, files) => {

		if (files && files.length) {
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
			const selections = Array.from(this.selection).concat(this.state.folder);
			onSelectionChange(selections);
		}
	}


	onTasksComplete = (completed, indeterminate) => {
		logger.log('All finished');

		const dismiss = () => this.setState({progress: void 0});

		function getLabel (x, postfix = '') {
			let [first, ...others] = x;

			const {error} = first;
			const errorKey = error && `COMPLETE.${error.code}`;
			const specificErrorMessage = error && t.isMissing(errorKey) ? null : t(errorKey);

			return t(`COMPLETE.${first.verb}${postfix}`, {
				filename: first.filename,
				count: others.length,
				message: specificErrorMessage || (error || {}).message || t('COMPLETE.unknown')
			});
		}

		if (indeterminate.length === 0) {
			dismiss();
		}
		else {
			const [confirmation, errors] = indeterminate.reduce((a,x) => (a[x.error ? 1 : 0].push(x), a), [[],[ ]]);

			let text = void 0;
			if (confirmation.length > 0) {
				text = getLabel(confirmation);
			}

			if (errors.length > 0) {
				alert(getLabel(errors, 'fail'));
			}

			this.progressDismissTimeout = setTimeout(dismiss, ONE_MINUTE);
			this.setState({
				progress: text && {
					dismiss,
					errors: errors.length > 0,
					text,
					max: 1,
					value: 1
				}
			});
		}
	}


	onTasksEnqueued = () => {
		logger.log('Starting to work on tasks');
	}


	onTaskProgress = (task, value, max, abort) => {
		const key = value === max ? 'COMPLETE' : 'ACTIVE';
		clearTimeout(this.progressDismissTimeout);

		this.setState({
			progress: {
				text: t(`${key}.${task.verb}`, {filename: task.filename, count: 0}),
				max,
				value,
				abort
			}
		});
	}


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
