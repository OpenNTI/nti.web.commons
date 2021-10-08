import './File.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import FilePickerButton from '../FilePickerButton';

export default class File extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string,
		accept: PropTypes.string,
		value: PropTypes.object, // existing file
		defaultText: PropTypes.string,
		onFileChange: PropTypes.func,
		checkValid: PropTypes.func,
	};

	state = {
		file: this.props.value,
	};

	clearFile = e => {
		if (e) {
			e.stopPropagation();
			e.preventDefault();
		}

		this.setState({ file: undefined });

		if (this.input) {
			this.input.value = '';
		}

		if (this.props.onFileChange) {
			this.props.onFileChange();
		}
	};

	onChange = e => {
		e.stopPropagation();
		e.preventDefault();

		const {
			target: { files },
		} = e;

		if (files && files.length === 1) {
			let inputValid = true;
			if (this.props.checkValid) {
				inputValid = this.props.checkValid(files[0]);
			}

			if (inputValid) {
				this.setState({ file: files[0] });

				if (this.props.onFileChange) {
					this.props.onFileChange(files[0]);
				}
			}
		}
	};

	render() {
		const attachRef = x => {
			this.input = x;
		};

		const {
			accept,
			defaultText = '',
			label = 'Choose file',
			className,
		} = this.props;
		const { file } = this.state;

		const props = {
			icon: 'upload',
			label,
			available: true,
			onChange: this.onChange,
			onDrop: this.onChange,
			attachRef: attachRef,
		};

		if (accept) {
			props.accept = accept;
		}

		const text = file?.name ?? defaultText;

		return (
			<div className={cx('nti-file-input', className)}>
				<FilePickerButton {...props} />
				<span
					className={cx('file-select-filename', {
						empty: !text || text === '',
					})}
				>
					<span className={cx({ 'no-file': !file })}>{text}</span>
				</span>
				{file && (
					<span
						className="file-select-reset"
						onClick={this.clearFile}
					>
						x
					</span>
				)}
			</div>
		);
	}
}
