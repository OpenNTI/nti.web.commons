import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from 'nti-lib-locale';
import cx from 'classnames';

const DEFAULT_TEXT = {
	title: 'Drag an Image to Upload, or',
	choose: 'Choose a File',
	requirements: 'Must be a .jpg or a .png under 10MB.',
	wrongType: 'File type is unsupported.',
	tooLarge: 'File is too large.',
	unknownError: 'Unable to upload file.'
};

const t = scoped('nti-web-commons.inputs.FileDrop', DEFAULT_TEXT);

export default class Upload extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		onError: PropTypes.func.isRequired,
		getString: PropTypes.func,
		sizeLimit: PropTypes.number,
		allowedTypes: PropTypes.object,
		error: PropTypes.string,
		className: PropTypes.string
	}


	get getString () {
		const {getString} = this.props;

		return getString ? t.override(getString) : t;
	}


	onFileChange = (e) => {
		e.preventDefault();

		const {onChange, allowedTypes, sizeLimit, onError} = this.props;

		const files = e.target.files;
		const file = files && files[0];

		if (!file) { return; }

		if (allowedTypes && !allowedTypes[file.type]) {
			onError(this.getString('wrongType'));
			return;
		}

		if (file.size > sizeLimit) {
			onError(this.getString('tooLarge'));
			return;
		}

		onChange(file);
	}


	render () {
		const {getString} = this;
		const {error, className} = this.props;
		
		return (
			<div className={cx('nti-web-commons-filedrop', className)}>
				<input type="file" className="asset-file" onChange={this.onFileChange} />
				<div className="container">
					<i className="icon-upload" />
					<span className="title">{getString('title')}</span>
					<div className="choose-container"><span className="choose">{getString('choose')}</span></div>
					<div className={cx('error-container', {error})}>
						<span className="error">{error || 'no error'}</span>
					</div>
					<span className="requirements">{getString('requirements')}</span>
				</div>
			</div>
		);
	}
}
