import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import BufferedInput from './BufferedInput';

const stop = e => e.preventDefault();

const Icon = styled('i')`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: 0.4375rem;
	font-size: 1.375rem;
	color: var(--tertiary-grey);
`;

const Reset = styled('input').attrs({ type: 'reset' })`
	transition: opacity 0.5s;
	opacity: 1;
	position: absolute;
	display: block;
	background-image: url(./assets/circle-x-grey-16.png);
	background-color: transparent;
	border: 0;
	cursor: pointer;
	margin: 0;
	padding: 0;
	width: 1rem;
	height: 1rem;
	top: 50%;
	transform: translateY(-50%);
	right: 0.5625rem;
	left: auto;
	overflow: hidden;
	text-indent: -1000px;

	&:focus,
	&:active {
		outline: none;
	}
`;

class Input extends React.Component {
	attachRef = x => (this.input = x);

	clear() {
		const {
			input,
			props: { onChange },
		} = this;
		input.value = '';
		if (onChange) {
			onChange({
				target: input,
				type: 'change',
				persist() {},
				preventDefault() {},
				stopPropagation() {},
			});
		}
	}

	focus() {
		if (this.input) {
			this.input.focus();
		}
	}

	render() {
		return <input {...this.props} ref={this.attachRef} />;
	}
}

const InputStyle = css`
	background: transparent;
	border: 0;
	color: var(--primary-grey);
	margin: 0;
	padding: 0 2rem;
	width: 100%;
	font-weight: normal;
	font-style: normal;
	font-size: 0.875rem;
	box-sizing: border-box;
	box-shadow: none;

	&:not(:valid) ~ input[type='reset'] {
		opacity: 0;
		cursor: text;
	}

	&:focus,
	&:active {
		outline: none;
	}

	&::placeholder {
		font-style: italic;
		color: var(--tertiary-grey);
		font-weight: 300;
	}

	&::-ms-clear {
		display: none;
	}
`;

class Search extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		onBlur: PropTypes.func,
		onFocus: PropTypes.func,
		defaultValue: PropTypes.string,
		buffered: PropTypes.bool,
		placeholder: PropTypes.string,
	};

	static defaultProps = {
		buffered: true,
	};

	state = {};

	attachRef = x => (this.input = x);

	clearFilter = e => {
		e.stopPropagation();
		e.preventDefault();
		const { input } = this;
		input.clear();
		input.focus();
	};

	onChange = event => {
		const { onChange } = this.props;
		if (onChange) {
			onChange(event.target.value);
		}
	};

	onFocus = e => {
		const { onFocus } = this.props;
		if (onFocus) {
			onFocus(e);
		}
		this.setState({ focused: true });
	};

	onBlur = e => {
		const { onBlur } = this.props;
		if (onBlur) {
			onBlur(e);
		}
		this.setState({ focused: false });
	};

	render() {
		const {
			props: {
				disabled,
				buffered,
				className,
				placeholder = 'Search',
				...props
			},
			state: { focused },
		} = this;
		const Cmp = buffered ? BufferedInput : Input;
		return (
			<form
				onSubmit={stop}
				className={cx(className, 'search-component', {
					focused,
					disabled,
				})}
				noValidate
			>
				<Icon className="icon-search" />
				<Cmp
					{...props}
					type="text"
					className={InputStyle}
					placeholder={placeholder}
					disabled={disabled}
					onChange={this.onChange}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
					ref={this.attachRef}
					required
				/>
				<Reset onClick={this.clearFilter} />
			</form>
		);
	}
}

export default styled(Search)`
	position: relative;
	overflow: hidden;
	background: #fafafa;
	border-radius: 0.3125rem;
	box-shadow: 0 0 0 0.0625rem #eaeaea;
	margin: 0.5rem;
	line-height: 2.375rem;

	&.square {
		border-radius: 0;
	}
`;
