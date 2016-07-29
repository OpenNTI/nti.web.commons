import React, {PropTypes} from 'react';
import cx from 'classnames';
import {dirname} from 'path';
import Transition from 'react-addons-css-transition-group';
import {scoped} from 'nti-lib-locale';
import Logger from 'nti-util-logger';

import CError from '../Error';
import Loading from '../Loading';

import BrowsableView from './BrowsableView';
import Chooser from './Chooser';
import Search from '../Search';
import ParentFolder from './ParentFolder';
import FolderName from './FolderName';
import Inspector from './Inspector';
import SearchScopeBar from './SearchScopeBar';
import View from './View';

import TableLayout from './layout/table';
import IconLayout from './layout/grid';

import Header, {TitleBalencer} from '../panels/Header';
import Toolbar, {Spacer as ToolbarSpacer} from '../panels/Toolbar';
import ToolbarButton from '../panels/ToolbarButton';
import ToolbarButtonGroup from '../panels/ToolbarButtonGroup';
import FilePickerButton from '../FilePickerButton';

import ProgressBar from '../ProgressBar';


const logger = Logger.get('common:components:content-resources:Browser');

const DEFAULT_TEXT = {
	DRAG_DROP: {
		'drag-over-mesasge': 'Drop Files Here to Upload them to Your Library.'
	},
	TOOLBAR: {
		'upload': 'Upload',
		'mkdir': 'Create Folder',
		'move': 'Move',
		'delete': 'Delete',
		'rename': 'Rename'
	}
};

const t = scoped('CONTENT_RESOURCES.BROWSER', DEFAULT_TEXT);

export default class ContentResourcesBrowser extends BrowsableView {
	static propTypes = {
		accept: PropTypes.func,
		filter: PropTypes.func,
		sourceID: PropTypes.string,
		onClose: PropTypes.func,
		onSelectionChange: PropTypes.func,
		onTrigger: PropTypes.func,
		limited: PropTypes.bool
	}


	toggle = () => this.setState({showInfo: !this.state.showInfo})


	onDelete = () => {
		const selection = Array.from(this.selection);

		this.selection.set();

		let last = Promise.resolve();

		for (let item of selection) {
			last = last
				.then(() => item.delete())
				.then(() => this.dropItem(item));
		}


		last.catch((e) => {
			logger.error(e);
			this.refresh();
		});
	}


	onDragOverChanged = (dragover) => {
		this.setState({dragover});
	}


	onFileDrop = (files) => {
		this.uploadFiles(files, this.state.folder);
	}


	onMakeDirectory = () => {
		const {folder} = this.state;
		const {last} = this.onMakeDirectory;

		const append = x => new Promise(next =>
			this.setState(
				{folderContents: [...this.state.folderContents, x]},
				() => next(x)
			));

		this.onMakeDirectory.last = (last || Promise.resolve())
			.then(() =>
				folder.mkdir()
					.then(append)
					.then(x => this.selection.set(x))
					.then(() => this.onRename())
					.catch(e => logger.error(e))
			);
	}


	onMoveSelectTarget = () => {
		const selected = Array.from(this.selection);
		const filter = x => !this.selection.isSelected(x);
		const accept = x => x.isFolder
							&& !this.selection.isSelected(x)
							&& !selected.some(item => dirname(item.path) === (x.path || '/'));

		if (selected.lenth < 1) {
			return;
		}

		Chooser.show(this.props.sourceID, accept, filter, 'Move', true)
			.then(folder => this.moveEntities(selected, folder))
			.then(this.refresh, this.refresh);
	}


	onRename = () => {
		const selections = Array.from(this.selection);
		if (selections.length !== 1) {
			logger.warn('Incorrect selection %o', Array.from(this.selection));
			return;
		}

		const [item] = selections;

		if (item.emit('rename')) {
			this.setState({renaming: true});
			item.once('rename-end', () => this.setState({renaming: false}));

		}
	}


	onUploadFile = (e) => {
		const {target: {files}} = e;
		this.uploadFiles(files, this.state.folder);
		//These three lines allow the same file to be selected over and over again.
		e.target.value = null;
		e.preventDefault();
		e.stopPropagation();
	}


	onSearch = (query) => {
		if (query && query.length > 0) {
			this.setState({folderContents: null, search: query}, this.search);
		}
		else {
			this.setState({folderContents: null, search: void 0, searchScope: void 0}, this.refresh);
		}
	}


	onChangeSearchScope = (scope) => this.setState({folderContents: null, searchScope: scope}, this.search)


	render () {
		const {
			selection,
			state: {
				dragover,
				error,
				folder,
				folderContents,
				layout: selectedLayout,
				showInfo,
				progress,
				renaming,
				root,
				search,
				searchScope = folder
			},
			props: {
				filter,
				limited
			}
		} = this;

		const layout = (selectedLayout == null && search ? TableLayout : selectedLayout) || IconLayout;

		const content = folderContents && filter ? folderContents.filter(filter) : folderContents;
		const searching = search && search.length > 0;

		const selections = Array.from(selection);
		const selected = selections.length;
		const currentFolderCan = x => folder && folder.can(x);
		const selectionCan = x => !limited && selected > 0 && selections.every(i => i.can(x));
		const disabled = (renaming); //modal states
		const hasInfo = selected === 1 && !selections[0].isFolder;
		const inspectItem = hasInfo ? selections[0] : void 0;

		const searchScopes = root === folder ? [root] : [root, folder];

		return (
			<div className="content-resource-browser">
				<Header onClose={this.props.onClose}>
					<div className="title-row">
						<ParentFolder folder={folder} onClick={this.gotoParent} emptyComponent={TitleBalencer}/>
						<FolderName folder={folder} />
						<TitleBalencer/>
					</div>
					<Toolbar>
						<FilePickerButton
							icon="upload"
							label={t('TOOLBAR.upload')}
							disabled={disabled}
							available={!limited && currentFolderCan('upload')}
							onChange={this.onUploadFile}
							multiple
							/>
						<ToolbarButton
							icon="folder-add"
							label={t('TOOLBAR.mkdir')}
							disabled={disabled}
							available={currentFolderCan('mkdir')}
							onClick={this.onMakeDirectory}
							/>
						<ToolbarButton
							icon="rename"
							label={t('TOOLBAR.rename')}
							disabled={disabled}
							available={selected === 1 && selectionCan('rename')}
							onClick={this.onRename}
							/>
						<ToolbarButton
							icon="move"
							label={t('TOOLBAR.move')}
							disabled={disabled}
							available={selectionCan('move')}
							onClick={this.onMoveSelectTarget}
							/>
						<ToolbarButton
							icon="delete"
							label={t('TOOLBAR.delete')}
							available={selectionCan('delete')}
							onClick={this.onDelete}
							/>

						<ToolbarSpacer/>

						<ToolbarButtonGroup>
							<ToolbarButton icon="list" checked={layout === TableLayout} onClick={this.setLayoutToList}/>
							<ToolbarButton icon="grid" checked={layout === IconLayout} onClick={this.setLayoutToGrid}/>
						</ToolbarButtonGroup>

						<ToolbarButton
							icon="hint"
							checked={showInfo}
							onClick={this.toggle}
							disabled={disabled || !hasInfo}
							/>
						<Search
							disabled={!currentFolderCan('search')}
							value={search || ''}
							onChange={this.onSearch}
							buffered={false}
							/>
					</Toolbar>
				</Header>

				{searching && (
					<SearchScopeBar scopes={searchScopes} scope={searchScope} onChange={this.onChangeSearchScope} />
				)}

				{error ? (
					<CError error={error}/>
				) : !folderContents ? (
					<Loading/>
				) : (
					<View contents={content}
						layout={layout}
						selection={selection}
						onDragOverChanged={this.onDragOverChanged}
						onFileDrop={this.onFileDrop}
						limited={limited || searching}
						>
						{showInfo && (
							<Inspector item={inspectItem}/>
						)}
					</View>
				)}


				<div className={cx('status-bar', {dragover})}>
					<Transition component="div" className=""
						transitionName="content-resource-browser-drop"
						transitionEnterTimeout={1}
						transitionLeaveTimeout={1}
						>
						{!dragover && progress && (
							<ProgressBar key="progress"
								max={progress.max}
								value={progress.value}
								text={progress.text}
								onCancel={progress.abort}
								onDismiss={progress.dismiss}
								/>
						)}

						{dragover && (
							<div key="drag" className="drag-over-message">
								{t('DRAG_DROP.drag-over-mesasge')}
							</div>
						)}
					</Transition>
				</div>
			</div>
		);
	}
}
