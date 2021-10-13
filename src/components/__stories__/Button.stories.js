import PropTypes from 'prop-types';

import Button from '../Button';
import * as Icons from '../../icons';

const Wrapper = (props) => (
	<>
		<input type="text" placeholder="Focusable Area" /><br /><br />
		<div {...props} /><br />
		<input type="text" placeholder="Focusable Area" />
	</>
);

export default {
	title: 'Components/Button',
	component: Button,
	argTypes: {
		onClick: {action: 'triggered'},
		label: {control: {type: 'text'}},
		rounded: {control: {type: 'boolean'}},
		disabled: {control: {type: 'boolean'}},
		secondary: {control: {type: 'boolean'}},
		destructive: {control: {type: 'boolean'}},
		plain: {control: {type: 'boolean'}}
	}
};


export const PlainText = ({label="Button Text", ...otherProps}) => (
	<Wrapper>
		<Button {...otherProps}>
			{label}
		</Button>
	</Wrapper>
);

export const LeftIcon = ({label="Button Text", ...otherProps}) => (
	<Wrapper>
		<Button {...otherProps}>
			<Icons.Alert />
			<span>{label}</span>
		</Button>
	</Wrapper>
);

export const RightIcon = ({label="Button Text", ...otherProps}) => (
	<Wrapper>
		<Button {...otherProps}>
			<span>{label}</span>
			<Icons.Alert />
		</Button>
	</Wrapper>
);


PlainText.propTypes = {
	label: PropTypes.string
};
