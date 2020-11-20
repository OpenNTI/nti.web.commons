/* eslint-env jest */
import {renderHook, act} from '@testing-library/react-hooks';
import {Date} from '@nti/lib-commons';

import usePersistantState from '../use-persistent-state';

const {MockDate} = Date;

describe('usePersistantState', () => {
	test('returns initial value', () => {
		const {result} = renderHook(() => usePersistantState('test-key', 'foo'));

		expect(result.current[0]).toBe('foo');
	});

	test('returns existing value', () => {
		global.localStorage.setItem('existing-key', 'foo');

		const {result} = renderHook(() => usePersistantState('existing-key', 'bar'));

		expect(result.current[0]).toBe('foo');
	});

	test('remembers until expireIn has passed', () => {
		MockDate.install();

		const {result, rerender} = renderHook(() => usePersistantState('expire-key', {initial: 'first', expireIn: 60000}));

		expect(result.current[0]).toBe('first');

		act(() => result.current[1]('second'));

		expect(result.current[0]).toBe('second');

		MockDate
			.setDestination(MockDate.now() + 65000)
			.hit88MPH();

		rerender();

		expect(result.current[0]).toBe('first');

		MockDate.uninstall();
	});
});
