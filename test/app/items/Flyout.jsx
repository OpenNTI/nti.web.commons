import React from 'react';

import {Flyout} from '../../../src';

export default function FlyoutTest () {
	return (
		<div style={{padding: '2rem'}}>
			<input />
			<br /><br />
			<Flyout.Triggered trigger={(<span>trigger</span>)}>
				<div>
					Flyout Contents
				</div>
			</Flyout.Triggered>
			<br /><br />
			<Flyout.OldTriggered trigger={(<span>trigger</span>)}>
				<div>
					Old Flyout Contents
				</div>
			</Flyout.OldTriggered>
			<br /><br />
			<Flyout.OldTriggered trigger={(<span>trigger</span>)}>
				<div>
					Old Flyout Contents
				</div>
			</Flyout.OldTriggered>
		</div>
	);
}