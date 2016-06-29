import React, {PropTypes} from 'react';
import {getService} from 'nti-web-client';
import {scoped} from 'nti-lib-locale';
import ObjectSelectionModel from 'nti-commons/lib/ObjectSelectionModel';
import Logger from 'nti-util-logger';

import CError from '../Error';
import Loading from '../Loading';

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

export default class ContentResourcesBrowser extends React.Component {
	static propTypes = {
		sourceID: PropTypes.string,
		onClose: PropTypes.func
	}

	static defaultProps = {
		onClose: () => {}
	}

	static childContextTypes = {
		onTrigger: PropTypes.func
	}


	constructor (props) {
		super(props);
		this.selection = new ObjectSelectionModel();
		this.state = {};

		this.selection.addListener('change', this.onSelectionChange);
	}


	getChildContext = () => ({
		onTrigger: this.onTrigger
	})


	componentWillUnmount () {
		this.selection.removeListener('change', this.onSelectionChange);
	}


	componentDidMount () {
		const {sourceID} = this.props;

		getService()
			.then(s => s.getObject(sourceID))
			.then(c => c.getResources())
			.then(folder => this.setFolder(folder))
			.catch(error => this.setState({error}));
	}


	setFolder = (folder) => {
		this.setState({folder, folderContents: void 0});

		folder.getContents()
			.then(c => this.setState({folderContents: c}))
			.catch(error => this.setState({error}));
	}


	gotoParent = () => {
		const {folder} = this.state;
		const parent = folder && folder.getParentFolder();
		if (parent) {
			this.setFolder(parent);
		}
	}


	onSelectionChange = () => {
		this.forceUpdate();
	}


	toggle = () => this.setState({showInfo: !this.state.showInfo})


	onRename = () => {
		const selections = Array.from(this.selection);
		if (selections.length !== 1) {
			logger.warn('Incorrect selection %o', this.selection);
			return;
		}

		const [item] = selections;

		item.emit('rename');
	}


	onTrigger = (item) => {
		if (item.isFolder) {
			return this.setFolder(item);
		}

		logger.debug('Selected File: %o', item);
	}


	render () {
		const {
			selection,
			state: {
				error,
				folder,
				folderContents,
				showInfo
			}
		} = this;

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
						<FilePickerButton icon="upload" label={t('TOOLBAR.upload')} available={can('upload')}/>
						<ToolbarButton icon="folder-add" label={t('TOOLBAR.mkdir')} available={can('mkdir')}/>
						<ToolbarButton icon="move" label={t('TOOLBAR.move')} available={selectionCan('move')}/>
						<ToolbarButton icon="delete" label={t('TOOLBAR.delete')} available={selectionCan('delete')}/>
						<ToolbarButton icon="rename" label={t('TOOLBAR.rename')} available={selected === 1 && selectionCan('rename')} onClick={this.onRename}/>
						<ToolbarSpacer/>
						<ToolbarButton icon="hint" checked={showInfo} onClick={this.toggle}/>
						<Search/>
					</Toolbar>
				</Header>
				{error ? (
					<CError error={error}/>
				) : !folderContents ? (
					<Loading/>
				) : (
					<View contents={folderContents} selection={selection}>
						{showInfo && (
							<Inspector selection={selection}/>
						)}
					</View>
				)}
			</div>
		);
	}
}
