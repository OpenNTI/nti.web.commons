import Task from './Task';


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
		this.verb = 'upload';
		this.filename = file.name;
	}


	startUpload = (file, folder) => {
		console.log(folder.getLink('upload'), file.name);
	}
}
