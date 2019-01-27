import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import FilePickerButton from '../FilePickerButton';

export default class File extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string,
		accept: PropTypes.string,
		value: PropTypes.object,	// existing file
		defaultText: PropTypes.string,
		onFileChange: PropTypes.func,
		checkValid: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = {
			file: props.value
		};
	}

	renderFileName () {
		if(this.state && this.state.file) {
			return (<span>{this.state.file.name}</span>);
		}

		const text = this.props.defaultText ? this.props.defaultText : '';

		return (<span className="nofile">{text}</span>);
	}

	clearFile = (e) => {
		e.stopPropagation();
		e.preventDefault();

		this.setState( { file: undefined });

		if(this.input) {
			this.input.value = '';
		}

		if(this.props.onFileChange) {
			this.props.onFileChange();
		}
	};

	renderClear () {
		if(this.state && this.state.file) {
			return(<span className="file-select-reset" onClick={this.clearFile}>x</span>);
		}
	}

	onChange = (e) => {
		e.stopPropagation();
		e.preventDefault();

		const {target: {files}} = e;

		if(files && files.length === 1) {
			let inputValid = true;
			if(this.props.checkValid) {
				inputValid = this.props.checkValid(files[0]);
			}

			if(inputValid) {
				this.setState({ file : files[0] });

				if(this.props.onFileChange) {
					this.props.onFileChange(files[0]);
				}
			}
		}
	};

	render () {
		const attachRef = (x) => {
			this.input = x;
		};

		const {label = 'Choose file', className} = this.props;

		let props = {
			icon: 'upload',
			label,
			available: true,
			onChange: this.onChange,
			onDrop: this.onChange,
			attachRef: attachRef
		};

		if(this.props.accept) {
			props.accept = this.props.accept;
		}

		return (
			<div className={cx('nti-file-input', className)}>
				<FilePickerButton
					{...props}
				/>
				<span className="file-select-filename">{this.renderFileName()}</span>
				{this.renderClear()}
			</div>
		);
	}
}
