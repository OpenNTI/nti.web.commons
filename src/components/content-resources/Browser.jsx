import React, {PropTypes} from 'react';

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
import View from './View';

import Header, {TitleBalencer} from '../panels/Header';
import Toolbar, {Spacer as ToolbarSpacer} from '../panels/Toolbar';
import ToolbarButton from '../panels/ToolbarButton';
import FilePickerButton from '../FilePickerButton';


const logger = Logger.get('common:components:content-resources:Browser');

const DEFAULT_TEXT = {
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
		onTrigger: PropTypes.func
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
		const accept = x => x.isFolder && !this.selection.isSelected(x);

		if (selected.lenth < 1) {
			return;
		}

		Chooser.show(this.props.sourceID, accept, filter, 'Move')
			.then(folder => this.moveEntities(selected, folder));
	}


	onRename = () => {
		const selections = Array.from(this.selection);
		if (selections.length !== 1) {
			logger.warn('Incorrect selection %o', Array.from(this.selection));
			return;
		}

		const [item] = selections;

		item.emit('rename');
	}


	render () {
		const {
			selection,
			state: {
				error,
				folder,
				folderContents,
				showInfo
			},
			props: {
				filter
			}
		} = this;

		const content = folderContents && filter ? folderContents.filter(filter) : folderContents;

		const selections = Array.from(selection);
		const selected = selections.length;
		const can = x => folder && folder.can(x);
		const selectionCan = x => selected > 0 && selections.every(i => i.can(x));

		return (
			<div className="content-resource-browser">
				<Header onClose={this.props.onClose}>
					<div className="title-row">
						<ParentFolder folder={folder} onClick={this.gotoParent} emptyComponent={TitleBalencer}/>
						<FolderName folder={folder} />
						<TitleBalencer/>
					</div>
					<Toolbar>
						<FilePickerButton icon="upload" label={t('TOOLBAR.upload')} available={can('upload')} disabled/>
						<ToolbarButton icon="folder-add" label={t('TOOLBAR.mkdir')} available={can('mkdir')} onClick={this.onMakeDirectory}/>
						<ToolbarButton icon="rename" label={t('TOOLBAR.rename')} available={selected === 1 && selectionCan('rename')} onClick={this.onRename}/>
						<ToolbarButton icon="move" label={t('TOOLBAR.move')} available={selectionCan('move')} onClick={this.onMoveSelectTarget}/>
						<ToolbarButton icon="delete" label={t('TOOLBAR.delete')} available={selectionCan('delete')} onClick={this.onDelete}/>
						<ToolbarSpacer/>
						<ToolbarButton icon="hint" checked={showInfo} onClick={this.toggle} disabled/>
						<Search disabled/>
					</Toolbar>
				</Header>
				{error ? (
					<CError error={error}/>
				) : !folderContents ? (
					<Loading/>
				) : (
					<View contents={content} selection={selection}>
						{showInfo && (
							<Inspector selection={selection}/>
						)}
					</View>
				)}
				<div className="progress"/>
			</div>
		);
	}
}
