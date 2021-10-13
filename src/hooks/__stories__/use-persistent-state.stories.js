
import { usePersistentState } from '../use-persistent-state';

export default {
	title: 'Hooks/usePersistentState',
	component: usePersistentState,
};

export const Base = () => {
	const [value, setValue] = usePersistentState('base-story', 'initial');

	return (
		<div>
			<p>
				The value in the input should be remembered forever across
				refreshes
			</p>
			<input
				type="text"
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
		</div>
	);
};

export const ExpiresIn = () => {
	const [value, setValue] = usePersistentState('expire-story', {
		initial: 'initial expire value',
		expireIn: 30000,
	});

	return (
		<div>
			<p>
				The value in the input should be remembered for 30 seconds
				across refreshes.
			</p>
			<input
				type="text"
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
		</div>
	);
};

export const Multiple = () => {
	const [value, setValue] = usePersistentState(
		'multiple-story',
		'multiple inputs'
	);

	return (
		<div>
			<p>
				The value should be shared between the two inputs across
				refreshes.
			</p>
			<input
				type="text"
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
			<br />
			<br />
			<input
				type="text"
				value={value}
				onChange={e => setValue(e.target.value)}
			/>
		</div>
	);
};
