import React from 'react';
import PropTypes from 'prop-types';

import FilePickerButton from '../FilePickerButton';

export default class File extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string,
		defaultText: PropTypes.string,
		onFileChange: PropTypes.func
	}

	renderFileName () {
		if(this.state && this.state.file) {
			return (<span>{this.state.file.name}</span>);
		}

		const text = this.props.defaultText ? this.props.defaultText : 'None';

		return (<span className="nofile">{text}</span>);
	}

	renderClear () {
		const me = this;

		const clearFile = (e) => {
			me.setState( { file: undefined });

			if(this.props.onFileChange) {
				this.props.onFileChange();
			}

			e.stopPropagation();
			e.preventDefault();
		};

		if(this.state && this.state.file) {
			return(<span className="file-select-reset" onClick={clearFile}>x</span>);
		}
	}

	render () {
		const me = this;

		const onChange = (e) => {
			const {target: {files}} = e;

			if(files && files.length === 1) {
				me.setState({ file : files[0] });

				if(me.props.onFileChange) {
					me.props.onFileChange(files[0]);
				}
			}
		};

		return (<div className="nti-file-input">
			<FilePickerButton
				icon="upload"
				label={'Choose file'}
				available
				onChange={onChange}
				onDrop={onChange}
			/>
			<span className="file-select-filename">{this.renderFileName()}</span>
			{this.renderClear()}
		</div>);
	}
}
