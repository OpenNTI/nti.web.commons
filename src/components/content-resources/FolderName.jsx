import './FolderName.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

FolderName.propTypes = {
	className: PropTypes.string,
	folder: PropTypes.shape({ getFileName: PropTypes.func }),
};

export default function FolderName(props) {
	const { className, folder } = props;
	return !folder ? null : (
		<span className={cx('folder-name-component', className)}>
			<i className="icon-folder" />
			{folder.getFileName()}
		</span>
	);
}
