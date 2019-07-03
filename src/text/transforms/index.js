import LimitLines from './LimitLines';
import Linkify from './Linkify';
import Overflow from './Overflow';

//NOTE: the order of these transforms matters
const Transforms = [
	Linkify,
	Overflow,
	LimitLines
];

export function getTransforms (props) {
	return Transforms.filter(transform => transform.shouldApply && transform.shouldApply(props));
}