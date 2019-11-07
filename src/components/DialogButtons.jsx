import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

DialogButtons.propTypes = {
	flat: PropTypes.bool,
	buttons: PropTypes.array
};
export default function DialogButtons (props) {
	const {buttons = [], flat, className: css} = props;

	const c = cx('dialog-buttons', {flat}, css);

	return (
		<div className={c}>
			{buttons.map( ({label, onClick, className, disabled, tag, ...buttonProps}, i) => {
				const classes = cx('button', className, {
					disabled,
					primary: i === buttons.length - 1,
					secondary: i < buttons.length - 1
				});
				let Button = tag || 'button';

				return (
					<Button {...buttonProps}
						role="button"
						key={label}
						className={classes}
						onClick={disabled ? null : onClick}>
						{label}
					</Button>
				);
			})}
		</div>
	);
}
