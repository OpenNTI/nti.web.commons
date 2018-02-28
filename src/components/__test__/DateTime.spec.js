/* eslint-env jest */
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import DateTime from '../DateTime';

const date = new Date('2015-10-22T21:00:00.000Z');
const relativeTo = new Date('2015-10-24T22:01:00.000Z'); //+1 day, and +1 hour
const relativeToOneDay = new Date('2015-10-23T22:00:00.000Z'); //+1 day, and +1 hour
const relativeToWeek1 = new Date('2015-10-29T22:00:00.000Z'); //+7 day
const relativeToWeek2 = new Date('2015-11-05T22:00:00.000Z'); //+14 day
const relativeToWeek3 = new Date('2015-11-12T22:00:00.000Z'); //+21 day
const relativeToMonth = new Date('2015-11-19T22:00:00.000Z'); //+27 day
const relativeToMonths = new Date('2015-12-31T22:00:00.000Z'); //+++ days

//Find a better way... since react frowns on "findDOMNode".
const getText = cmp => ReactDOM.findDOMNode(cmp).textContent;//eslint-disable-line

const render = (node, cmp, props, ...children) => new Promise(next =>
	void ReactDOM.render(
		React.createElement(cmp, {...props, ref (x) {cmp = x; props.ref && props.ref(x);}}, ...children),
		node,
		() => next(cmp)
	));


describe('DateTime', () => {
	let container = document.createElement('div');
	let newNode;

	document.body.appendChild(container);


	beforeEach(()=> {
		newNode = document.createElement('div');
		document.body.appendChild(newNode);
	});

	afterEach(()=> {
		ReactDOM.unmountComponentAtNode(newNode);
		document.body.removeChild(newNode);
	});

	afterAll(()=> {
		ReactDOM.unmountComponentAtNode(container);
		document.body.removeChild(container);
	});


	const testRender = (props, ...children) => [
		render(newNode, DateTime, props, ...children),
		render(container, DateTime, props, ...children)
	];



	test('Base Cases: date only', (done) => {
		Promise.all(testRender({date}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/October \d\d, 2015/)))
			.then(done, (e) => done.fail(e));
	});


	test('Base Cases: date, relative to now', (done) => {
		const yesterday = moment().subtract(1, 'days');

		Promise.all(testRender({date: yesterday, relative: true}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toEqual('a day ago')))
			.then(done, (e) => done.fail(e));
	});

	test('Base Cases: date, relative to {Date}', (done) => {
		Promise.all(testRender({date, relative: true, relativeTo}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/\d days ago/)))
			.then(done, (e) => done.fail(e));
	});

	test('Base Cases: date, relative to one day', (done) => {
		Promise.all(testRender({date, relative: true, relativeTo: relativeToOneDay}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/a day ago/)))
			.then(done, (e) => done.fail(e));
	});

	test('relativeTo turns on relative', (done) => {
		Promise.all(testRender({date, relativeTo}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/\d days ago/)))
			.then(done, (e) => done.fail(e));
	});

	test('relativeTo: Weeks 1', (done) => {
		Promise.all(testRender({date, relativeTo: relativeToWeek1}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/1 week ago/)))
			.then(done, (e) => done.fail(e));
	});

	test('relativeTo: Weeks 2', (done) => {
		Promise.all(testRender({date, relativeTo: relativeToWeek2}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/2 weeks ago/)))
			.then(done, (e) => done.fail(e));
	});

	test('relativeTo: Weeks 3', (done) => {
		Promise.all(testRender({date, relativeTo: relativeToWeek3}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/3 weeks ago/)))
			.then(done, (e) => done.fail(e));
	});

	test('relativeTo: Weeks 4 (month)', (done) => {
		Promise.all(testRender({date, relativeTo: relativeToMonth}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/a month ago/)))
			.then(done, (e) => done.fail(e));
	});

	test('relativeTo: Months', (done) => {
		Promise.all(testRender({date, relativeTo: relativeToMonths}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/\d months ago/)))
			.then(done, (e) => done.fail(e));
	});


	test('Base Cases: date, alternate format', (done) => {
		const format = '[year:] YYYY';

		Promise.all(testRender({date, format}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/year: \d{4}/)))
			.then(done, (e) => done.fail(e));
	});

	test('Base Cases: relative date, no suffix', (done) => {
		const yesterday = moment().subtract(1, 'days');

		Promise.all(testRender({date: yesterday, relative: true, suffix: false}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toEqual('a day')))
			.then(done, (e) => done.fail(e));
	});

	test('Base Cases: relative date, custom suffix', (done) => {
		const yesterday = moment().subtract(1, 'days');

		Promise.all(testRender({date: yesterday, relative: true, suffix: ' bananas'}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toEqual('a day bananas')))
			.then(done, (e) => done.fail(e));
	});

	test('Base Cases: date, prefix', (done) => {
		const yesterday = moment(date).subtract(1, 'days');

		Promise.all(testRender({date: yesterday, prefix: 'toast '}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/toast October \d+, 2015/)))
			.then(done, (e) => done.fail(e));
	});

	test('Base Cases: date, showToday', (done) => {
		const now = new Date();

		Promise.all(testRender({date: now, showToday: true}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toEqual('Today')))
			.then(done, (e) => done.fail(e));
	});

	test('Base Cases: date, showToday, custom message', (done) => {
		const now = new Date();
		const todayText = 'coffee';

		Promise.all(testRender({date: now, showToday: true, todayText}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toEqual(todayText)))
			.then(done, (e) => done.fail(e));
	});


	test('todayText turns on showToday', (done) => {
		const todayText = 'coffee';
		const now = new Date();

		Promise.all(testRender({date: now, todayText}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toEqual(todayText)))
			.then(done, (e) => done.fail(e));
	});

	test('supports timezone abbreviation', (done) => {
		const now = new Date();

		Promise.all(testRender({date: now, format: 'z'}))
			.then(cmp => cmp.forEach(c => expect(getText(c)).toMatch(/[A-Z]{2,}/i)))
			.then(done, (e) => done.fail(e));
	});


	describe('formatDuration tests', () => {
		const f = (...args) => DateTime.formatDuration(...args);

		test('Only seconds', () => {
			expect(f(30)).toEqual('0:30');
			expect(f(0)).toEqual('0:00');
			expect(f(59)).toEqual('0:59');
		});

		test('Minutes and Seconds', () => {
			expect(f(60)).toEqual('1:00');
			expect(f(65)).toEqual('1:05');
			expect(f(120)).toEqual('2:00');
			expect(f(630)).toEqual('10:30');
		});

		test('Hours, Minutes, and Seconds', () => {
			expect(f(3600)).toEqual('1:00:00');
			expect(f(3605)).toEqual('1:00:05');
			expect(f(3720)).toEqual('1:02:00');
			expect(f(36000)).toEqual('10:00:00');
		});
	});

});
