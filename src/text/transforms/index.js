import LimitLines from './LimitLines';
import Overflow from './Overflow';

//NOTE: the order of these transforms matters
const Transforms = [
	Overflow,
	LimitLines
];

export function getTransforms (props) {
	return Transforms.filter(transform => transform.shouldApply && transform.shouldApply(props));
}