import FixAspect from './FixAspect';

const Transforms = [
	FixAspect
];

export function getTransforms (props) {
	return Transforms.filter(t => t.shouldApply && t.shouldApply(props));
}