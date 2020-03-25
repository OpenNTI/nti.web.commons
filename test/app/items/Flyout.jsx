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
			<input />
		</div>
	);
}