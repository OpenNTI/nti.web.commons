import React from 'react';
import cx from 'classnames';

export default class DialogButtons extends React.Component {

	static propTypes = {
		flat: React.PropTypes.bool,
		buttons: React.PropTypes.array
	}

	render () {

		const {buttons = [], flat} = this.props;

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
}
