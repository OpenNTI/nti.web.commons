/* eslint-env jest */
import * as format from '../format';

const getMilliSeconds = n => n;
const getSeconds = n => n * getMilliSeconds(1000);
const getMinutes = n => n * getSeconds(60);
const getHours = n => n * getMinutes(60);
const getDays = n => n * getHours(24);

describe('formatDuration tests', () => {
	const f = (...args) => format.formatDuration(...args);

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

describe('getNaturalDuration', () => {
	const n = (...args) => format.getNaturalDuration(...args);

	test('days', () => {
		expect(n(getDays(1), 1)).toEqual('1 Day');
		expect(n(getDays(2), 1)).toEqual('2 Days');
		expect(n(getDays(2), 1, true)).toEqual('2 Day');
	});

	//TODO: add more tests
});

describe('getShortNaturalDuration', () => {
	const n = (...args) => format.getShortNaturalDuration(...args);

	test('days', () => {
		expect(n(getDays(1), 1)).toEqual('1d');
		expect(n(getDays(2), 1)).toEqual('2d');
	});

	test('hours and minutes', () => {
		expect(n(getHours(1) + getMinutes(30), 2)).toEqual('1h 30m');
	});
});
