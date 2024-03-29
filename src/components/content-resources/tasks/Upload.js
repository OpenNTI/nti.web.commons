import Logger from '@nti/util-logger';

import Task from './Task';

const logger = Logger.get('common:components:content-resources:tasks:Upload');

export default class Upload extends Task {
	/**
	 * Upload the file to the path
	 *
	 * @param  {File} file - file object from the browser's dataTranserver.files.
	 * @param  {Object} folder - The Entity folder to upload to.
	 * @param  {Function} [onComplete] - Optional callback for when the task completes
	 * @returns {void}
	 */
	constructor(file, folder, onComplete) {
		super(() => this.startUpload(file, folder), file.size, onComplete);
		this.needsConfirmation = true;
		this.verb = 'upload';
		this.filename = file.name;
		this.file = file;
		this.folder = folder;
	}

	abort = () => {
		if (this.xhr) {
			this.needsConfirmation = false;
			this.xhr.abort();
			this.emit('abort', this);
		}
	};

	startUpload = (file, folder) => {
		const url = folder.getLink('upload');
		const xhr = (this.xhr = new XMLHttpRequest());

		xhr.addEventListener('progress', e => logger.log('Progress %o', e));

		function json(str) {
			try {
				return JSON.parse(str);
			} catch (e) {
				return { message: str };
			}
		}

		if (!url) {
			return Promise.reject(
				Object.assign(
					new Error(`Cannot upload into ${folder.getFileName()}.`),
					{
						code: 'PermissionDeniedNoLink',
						statusCode: 401,
					}
				)
			);
		}

		return new Promise((finish, error) => {
			const formdata = new FormData();

			formdata.append(file.name, file);

			xhr.open('POST', url, true);

			xhr.setRequestHeader('accept', 'application/json');
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

			this.emitProgress(1, this.total);

			xhr.upload.onprogress = e =>
				e.lengthComputable &&
				this.emitProgress(e.loaded - 1, e.total, this.abort);
			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					this.emitProgress(this.total, this.total);
					const { Items: [fileObj] = [] } =
						json(xhr.responseText) || {};
					finish(folder.castFile(fileObj));
				} else {
					error({
						status: xhr.status,
						statusText: xhr.statusText,
						...json(xhr.responseText),
					});
				}
			};

			setTimeout(() => xhr.send(formdata), 1);
		});
	};
}
