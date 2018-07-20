/* eslint-env jest */
import React from 'react';
import {shallow} from 'enzyme';

import TokenEditor from '../TokenEditor';

describe('TokenEditor', () => {
	const sharedWrapper = shallow(<TokenEditor />);

	const testRender = (props) => [
		shallow(<TokenEditor {...props}/>),
		sharedWrapper.setProps({...props})
	];

	test('Base Case', async () => {
		testRender({value: ['test']});
	});

	//TODO: Validate DOM structure.
	//TODO: Validate children && DIV.sub do not render if it is not checked.
});
