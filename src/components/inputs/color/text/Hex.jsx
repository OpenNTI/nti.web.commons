import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Color, String as StringUtils } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';

import Text from '../../Text';

const t = scoped('common.inputs.color.text.Hex', {
	placeholder: '#RRGGBB',
});

const Input = styled(Text).attrs(props => ({
	...props,
	className: cx('nti-color-hex-input', props.className),
}))`
	width: 100%;
	border-radius: 0;
	background: white;
`;

const ValidHexRegex = /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i;
const ValidInput = /^#?[a-f0-9]{0,6}$/i;
const PASTE_FILTER = /(#?[a-f0-9]{0,6})/im;

function fix(value) {
	if (value && value.charAt(0) !== '#') {
		return `#${value}`;
	}

	return value;
}

function safelyGetColor(value) {
	try {
		return Color.fromHex(value);
	} catch (e) {
		return null;
	}
}

export default class NTIHexInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.shape({
			isSameColor: PropTypes.func,
			hex: PropTypes.shape({
				toString: PropTypes.func,
			}),
		}),
		onChange: PropTypes.func,
	};

	state = { value: '' };

	componentDidMount() {
		this.setup();
	}

	componentDidUpdate(prevProps) {
		const { value } = this.props;
		const { value: prevValue } = prevProps;

		if (value !== prevValue) {
			this.setup();
		}
	}

	setup() {
		const { value } = this.props;
		const { value: oldValue } = this.state;
		const oldColor = safelyGetColor(oldValue);

		if (!value || !value.isSameColor(oldColor)) {
			this.setState({
				value: value ? value.hex.toString() : '',
			});
		}
	}

	onChange = value => {
		if (!ValidInput.test(value)) {
			return;
		}

		const { onChange } = this.props;

		this.setState(
			{
				value,
			},
			() => {
				if (ValidHexRegex.test(value) && onChange) {
					onChange(Color.fromHex(fix(value)));
				}
			}
		);
	};

	onPaste = event => {
		event.preventDefault();

		const {
			clipboardData,
			target: { selectionStart, selectionEnd, value },
		} = event;
		const start = Math.min(selectionStart, selectionEnd);
		const end = Math.max(selectionStart, selectionEnd);

		const data = clipboardData?.getData('text/plain') || '';

		const inserted = StringUtils.replaceRange(value, start, end, data);

		const [match] = PASTE_FILTER.exec(inserted);

		if (match) {
			this.onChange(fix(match));
		}
	};

	render() {
		return (
			<Input
				className={this.props.className}
				placeholder={t('placeholder')}
				value={this.state.value}
				onPaste={this.onPaste}
				onChange={this.onChange}
			/>
		);
	}
}
