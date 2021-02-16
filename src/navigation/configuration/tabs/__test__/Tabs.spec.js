/* eslint-env jest */
import React from 'react';
import TestRenderer from 'react-test-renderer';

import Store from '../../../Store';
import Tabs from '../Tabs';
import Tab from '../Tab';

const store = Store.getStore();

describe('Tabs Config', () => {
	test('Sets the correct config', () => {
		TestRenderer.create(
			<Tabs>
				<Tab label="tab1" route="/route1" active />
				<Tab label="tab2" route="/route2" />
				<Tab label="tab3" route="/route3" />
			</Tabs>
		);

		const tabs = store.get('tabs');

		expect(tabs.length).toEqual(3);

		expect(tabs[0].label).toEqual('tab1');
		expect(tabs[0].route).toEqual('/route1');
		expect(tabs[0].active).toBeTruthy();

		expect(tabs[1].label).toEqual('tab2');
		expect(tabs[1].route).toEqual('/route2');
		expect(tabs[1].active).toBeFalsy();

		expect(tabs[2].label).toEqual('tab3');
		expect(tabs[2].route).toEqual('/route3');
		expect(tabs[2].active).toBeFalsy();
	});
});
