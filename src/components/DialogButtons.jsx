import './DialogButtons.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from './Button';

DialogButtons.propTypes = {
	flat: PropTypes.bool,
	buttons: PropTypes.array,
};
export default function DialogButtons(props) {
	const { buttons = [], flat, className: css } = props;

	const c = cx('dialog-buttons', { flat }, css);

	return !buttons ? null : (
		<div className={c}>
			{buttons
				.slice()
				.reverse()
				.map(
					(
						{
							label,
							onClick,
							className,
							disabled,
							as,
							tag,
							...buttonProps
						},
						i
					) => {
						const classes = cx('button', className, {
							disabled,
							primary: i === 0,
							secondary: i > 0,
						});

						return (
							<Button
								{...buttonProps}
								as={as || tag || 'button'}
								key={label}
								className={classes}
								onClick={disabled ? null : onClick}
								plain
							>
								{label}
							</Button>
						);
					}
				)}
		</div>
	);
}
