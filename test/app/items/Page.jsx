import React from 'react';

import {Page} from '../../../src';

const {Content, Navigation} = Page;
const {Outline} = Navigation;

export default function PageTest () {
	return (
		<div style={{backgroundColor: 'skyblue', height: '100vh'}}>
			<Page>
				<Navigation>
					<Outline>
						<Outline.Header title="Outline Header" />
						<Outline.Item href="#">Test Item</Outline.Item>
					</Outline>
				</Navigation>
				<Content>
					<Content.Error error="Test Error" />
				</Content>
			</Page>
		</div>
	);
}