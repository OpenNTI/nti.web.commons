import React from 'react';

import {Page} from '../../../src';

const {Content, Navigation} = Page;
const {Outline} = Navigation;

export default function PageTest () {
	return (
		<Page>
			<Navigation>
				<Outline>
					<Outline.Header title="Outline Header" />
					<input />
					<Outline.Item href="#">Test Item</Outline.Item>
				</Outline>
			</Navigation>
			<Content>
				Content
			</Content>
		</Page>
	);
}