import React from 'react';
import cx from 'classnames';

DialogButtons.propTypes = {
	flat: React.PropTypes.bool,
	buttons: React.PropTypes.array
};
export default function DialogButtons (props) {
	const {buttons = [], flat} = props;

	const c = cx('dialog-buttons', {flat});

	return (
		<div className={c}>
			{buttons.map( (b, i) => {
				const classes = cx('button', b.className, {
					primary: i === buttons.length - 1,
					secondary: i < buttons.length - 1
				});
				return (
					<div key={b.label}
						className={classes}
						onClick={b.onClick}>
							{b.label}
					</div>
				);
			})}
		</div>
	);
}
