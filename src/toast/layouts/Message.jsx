import React from 'react';
import PropTypes from 'prop-types';

ToastMessage.propTypes = {
	title: PropTypes.string,
	message: PropTypes.string,
	dismissable: PropTypes.bool
};
export default function ToastMessage ({title, message, dismissable}) {
	return (
		<div>
			{title}:{message}
		</div>
	);
}