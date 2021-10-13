
import Tooltip from '../../../components/Tooltip';
import { DateIcon } from '../DateIcon';

export default {
	title: 'DateIcon',
	component: DateIcon,
};

export const Basic = ({ format, ...props }) => (
	<Tooltip label="wut">
		<DateIcon onClick={() => alert('click')} date={new Date()} />
	</Tooltip>
);
