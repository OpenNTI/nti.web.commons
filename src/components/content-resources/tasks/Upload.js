import Task from './Task';
import Logger from 'nti-util-logger';

const logger = Logger.get('common:components:content-resources:tasks:Upload');

export default class Upload extends Task {

	/**
	 * Upload the file to the path
	 *
	 * @param  {File} file - file object from the browser's dataTranserver.files.
	 * @param  {object} folder - The Entity folder to upload to.
	 * @param  {function} [onComplete] - Optional callback for when the task completes
	 * @return {void}
	 */
	constructor (file, folder, onComplete) {
		super(()=> this.startUpload(file, folder), 1, onComplete);
		this.needsConfirmation = true;
		this.verb = 'upload';
		this.filename = file.name;
	}


	startUpload = (file, folder) => {
		logger.log(folder.getLink('upload'), file.name);
	}
}
