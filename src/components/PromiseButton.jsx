import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { wait } from '@nti/lib-commons';

import { Ellipsis } from './loading-indicators';

const DISABLED = 'disabled';
const HIDE = 'hide';
const NORMAL = 'normal';
const PROCESSING = 'processing';
const FINISHED = 'finished';
const FINISHED_ERROR = 'finished-error';

const RESET_DELAY = 1000; //milliseconds
const MIN_DELAY_BEFORE_FINISHING = 1000; // milliseconds

function useExecutor(set, onClick) {
	let resetTimer;
	let cancelArtificialDelay;

	const handler = useCallback(
		async e => {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}

			let reset = NORMAL;
			let done;
			let error = false;
			let work = new Promise(f => (done = f));

			const selectFinalState = {
				disable: () => (reset = DISABLED),
				hide: () => (reset = HIDE),
				reset: () => (reset = NORMAL),
				retain: () => (reset = null),
				call: fn => (reset = fn),
			};
			// Ensure the react component has redrawn. (using setState's callback)
			set(PROCESSING);
			const ensureDelay = wait.min(MIN_DELAY_BEFORE_FINISHING);
			cancelArtificialDelay = ensureDelay.cancel;

			try {
				await onClick?.(work, selectFinalState);
				await ensureDelay();
				// Once the onClick task has been completed, set the state to finished
				set(FINISHED);
			} catch (e) {
				if (e === 'canceled') {
					return;
				}

				error = e;
				// The onClick function should still handle its own errors, it can opt
				// to ALSO throw the error to make this caller aware as to show an error state.
				set(FINISHED_ERROR);
				reset = NORMAL;
			}

			// Schedule the reset. If the component is unmounted before the reset,
			// the cleanup hook will cancel the timer.

			resetTimer = setTimeout(() => {
				if (typeof reset === 'string') {
					set(reset);
				}
				done();
				if (typeof reset === 'function') {
					reset(error);
				}
			}, RESET_DELAY);
		},
		[set, onClick]
	);

	useEffect(
		// register a cleanup callback
		() =>
			// The effect hook function needs to return a function
			() => {
				//clearTimeout is safe to call on any value.
				clearTimeout(resetTimer);
				cancelArtificialDelay?.();
			},
		[set, onClick]
	);

	useEffect(
		// register a cleanup callback
		() =>
			// The effect hook function needs to return a function
			() => {
				set = () => null;
			},
		[]
	);

	return handler;
}

const Layer = styled.li`
	flex: 0 0 100%;
	overflow: hidden;
	margin: 0;
	padding: 0;
	position: relative;
	border-radius: inherit;
	transition: background-color 250ms ease-in;
	width: 100%;

	& > span {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
		width: max-content;
	}

	&.processing > * {
		align-items: center;
		display: flex;
		flex: 1 1 auto;
	}
`;

const Group = styled.ul`
	border-radius: inherit;
	list-style-type: none;
	font-size: inherit;
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	transition: top 0.25s ease-in;

	&,
	${Layer} {
		display: flex;
		align-content: center;
		align-items: center;
		flex-direction: column;
	}
`;

const Sizer = styled.span`
	visibility: hidden;
`;

const Structure = styled.button`
	position: relative;
	background-color: transparent;

	&.state-disable {
		opacity: 0.5;
		pointer-events: none;
	}

	&.state-hide {
		visibility: hidden;
		pointer-events: none;
	}

	&.state-processing ${Group} {
		pointer-events: none;
		transform: translate3d(0, -100%, 0);
		transition: transform 0.25s ease-in;
	}

	&.state-finished ${Group}, &.state-finished-error ${Group} {
		pointer-events: none;
		transform: translate3d(0, -200%, 0);
		transition: transform 0.25s ease-in;
	}

	&.state-finished-error ${Layer} {
		pointer-events: none;
		background-color: var(--primary-red);
	}
`;

const Mask = styled.div`
	clip: rect(0 auto auto 0);
	inset: 0;
	position: absolute;
	border-radius: inherit;
`;

PromiseButton.propTypes = {
	children: PropTypes.any, //simple nodes only please
	className: PropTypes.string,
	initialState: PropTypes.oneOf([
		DISABLED,
		HIDE,
		NORMAL,
		PROCESSING,
		FINISHED,
		FINISHED_ERROR,
	]),

	// The callback can return a promise if the work to be done will be async...
	onClick: PropTypes.func,
	// mirror other buttons and accept a disabled prop
	disabled: PropTypes.bool,

	renderFinalState: PropTypes.func,
};

PromiseButton.states = {
	DISABLED,
	HIDE,
	NORMAL,
	PROCESSING,
	FINISHED,
	FINISHED_ERROR,
};

PromiseButton.defaultProps = {
	initialState: NORMAL,
	onClick: () => wait(2000),
};

function PromiseButton({
	children: label,
	onClick,
	className,
	initialState,
	renderFinalState,
	...props
}) {
	const [status, setStatus] = useState(initialState);
	const go = useExecutor(setStatus, onClick);

	const css = cx('promise-button', status, className);

	const final = renderFinalState?.(status) ?? (
		<i
			className={status !== FINISHED_ERROR ? 'icon-check' : 'icon-bold-x'}
		/>
	);

	return (
		<Structure
			{...props}
			className={css}
			onClick={!props.disabled && status === NORMAL ? go : void 0}
			state={status}
			disabled={status === DISABLED || props.disabled}
		>
			<Sizer>
				<span>{label}</span>
			</Sizer>
			<Mask>
				<Group>
					<Layer>
						<span>{label}</span>
					</Layer>

					<Layer processing>
						<Ellipsis />
					</Layer>

					<Layer>
						<span>{final}</span>
					</Layer>
				</Group>
			</Mask>
		</Structure>
	);
}

const StyledPromiseButton = styled(PromiseButton)`
	&:focus {
		outline: none;
	}

	-webkit-appearance: none;
	position: relative;
	margin: 0.5rem;
	overflow: hidden;
	border-radius: 3px;
	text-transform: none;
	letter-spacing: 0;
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
	border: 1px solid rgba(0, 0, 0, 0.5);
	font-weight: 600;
	color: white;
	padding: 0.5em 1.5em;
`;

export default StyledPromiseButton;
StyledPromiseButton.impl = PromiseButton;
StyledPromiseButton.IMPL = PromiseButton;
