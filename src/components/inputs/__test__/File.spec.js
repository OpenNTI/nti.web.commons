import React from 'react';
import {mount} from 'enzyme';

import File from '../File';

describe('File Input', () => {
	it('clears file', () => {
		const cmp = mount(<File label="testLabel"/>);

		cmp.setState({ file : { name: 'testFile' }});

		expect(cmp.state().file).toBeDefined();

		const clearButton = cmp.find('.file-select-reset');

		clearButton.simulate('click');

		cmp.update();

		expect(cmp.state().file).toBeUndefined();
	});

	it('has correct contents', () => {
		const cmp = mount(<File label="choose a file" defaultText="this is the default"/>);

		expect(cmp.text()).toMatch(/this is the default/);
		expect(cmp.find('.file-select-reset').length).toBe(0);

		cmp.setState({ file : { name: 'testFile' }});

		expect(cmp.text()).toMatch(/choose a file/);
		expect(cmp.find('.file-select-reset').length).toBe(1);
	});

	it('calls on change', () => {
		const onFileChange = () => {};

		const cmp = mount(<File label="choose a file" defaultText="this is the default" onFileChange={onFileChange}/>);

		const fileInput = cmp.find('input[type="file"]');

		expect(fileInput.length).toBe(1);

		fileInput.first().simulate('change');

		setTimeout(function () {
			expect(onFileChange).toHaveBeenCalled();
		},500);
	});
});
