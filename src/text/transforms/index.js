import Escape from './Escape';
import LimitLines from './LimitLines';
import Linkify from './Linkify';
import Overflow from './Overflow';
import Translate from './Translate';

//NOTE: the order of these transforms matters
const Transforms = [
	Translate,
	Escape,
	Linkify,
	LimitLines,
	Overflow,
];

export function getTransforms (props) {
	return Transforms.filter(transform => transform.shouldApply?.(props));
}
