import {ALIGN_CENTER} from '../Constants';

export default function getAlignmentClass (alignment, vAlign, hAlign) {
	//TODO: figure out what to do for horizontal alignment
	let vCls = '';
	let hCls = '';

	if (alignment.top != null) {
		vCls = 'bottom';
	} else if (alignment.bottom != null) {
		vCls = 'top';
	}

	if (!hAlign || hAlign === ALIGN_CENTER) {
		hCls = 'center';
	} else if (alignment.left != null) {
		hCls = 'left';
	} else if (alignment.right != null) {
		hCls = 'right';
	}

	return vCls && hCls ? `${vCls} ${hCls}` : (vCls || hCls);
}
