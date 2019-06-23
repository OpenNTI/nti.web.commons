import LimitLines from './LimitLines';
import Overflow from './Overflow';

export function getTransforms (props) {
	const transforms = [];

	if (props.overflow != null) {
		transforms.push(Overflow);
	}

	if (props.limitLines != null) {
		transforms.push(LimitLines);
	}


	return transforms;
}