import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

const DEFAULT_TEXT = {
	title: 'Drag an Image to Upload, or',
	choose: 'Choose a File',
	requirements: 'Must be a .jpg or a .png under 10MB.',
	wrongType: 'File type is unsupported.',
	tooLarge: 'File is too large.',
	unknownError: 'Unable to upload file.'
};

const t = scoped('web-commons.inputs.FileDrop', DEFAULT_TEXT);

export default class Upload extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		onError: PropTypes.func.isRequired,
		value: PropTypes.object,
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


	onFileRemove = () => {
		const {onChange} = this.props;

		if(this.input) {
			this.input.value = '';
		}

		// pass empty to onChange, effectively indicating removal
		onChange();
	}


	renderFileName () {
		return (
			<div className={cx('file-name')}>
				<div className={cx('name')}>{this.props.value && this.props.value.name}</div>
				<div onClick={this.onFileRemove} className={cx('remove-file')}>
					<i className="icon-light-x"/>
				</div>
			</div>
		);
	}


	attachRef = (x) => {
		this.input = x;
	}


	render () {
		const {getString} = this;
		const {error, className, value} = this.props;

		return (
			<div className={cx('@nti/web-commons-filedrop', className)}>
				<input type="file" ref={this.attachRef} className="asset-file" onChange={this.onFileChange} />
				<div className="container">
					<i className="icon-upload" />
					<span className="title">{getString('title')}</span>
					{
						value
							? this.renderFileName()
							: (<div className="choose-container"><span className="choose">{getString('choose')}</span></div>)
					}
					<div className={cx('error-container', {error})}>
						<span className="error">{error || 'no error'}</span>
					</div>
					<span className="requirements">{getString('requirements')}</span>
				</div>
			</div>
		);
	}
}
