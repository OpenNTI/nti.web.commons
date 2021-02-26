import Escape from './Escape';
import LimitLines from './LimitLines';
import Linkify from './Linkify';
import Translate from './Translate';

//NOTE: the order of these transforms matters
const Transforms = [Translate, Escape, Linkify, LimitLines];

export function getTransforms(props) {
	return Transforms.filter(transform => transform.shouldApply?.(props));
}
