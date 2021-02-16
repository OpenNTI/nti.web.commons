import cx from 'classnames';

export default function mergeProps(target, props) {
	const { className: targetClassname, ...targetOther } = target;
	const { className: propsClassname, ...propsOther } = props;

	return {
		className: cx(targetClassname, propsClassname),
		...targetOther,
		...propsOther,
	};
}
