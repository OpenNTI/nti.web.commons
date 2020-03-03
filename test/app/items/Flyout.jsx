import React from 'react';

import {Flyout} from '../../../src';

export default function FlyoutTest () {
	return (
		<div style={{padding: '2rem'}}>
			<input />
			<br /><br />
			<Flyout.Triggered trigger={(<span>trigger</span>)} constrain arrow>
				<div style={{padding: '2rem'}}>
					Flyout Contents
					<br />
					<input />
					<br />
					<input />
				</div>
			</Flyout.Triggered>
			<br /><br />
			<Flyout.OldTriggered trigger={(<span>trigger</span>)} sizing={Flyout.SIZES.MATCH_SIDE}>
				<div style={{padding: '2rem'}}>
					Old Flyout Contents
				</div>
			</Flyout.OldTriggered>
			<br /><br />
			<Flyout.OldTriggered trigger={(<span>trigger</span>)}>
				<div>
					Old Flyout Contents
				</div>
			</Flyout.OldTriggered>
			<input />
		</div>
	);
}