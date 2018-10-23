import {
	DEFAULT_SIZING,
	VERTICAL,
	MATCH_SIDE,
} from '../Constants';


export const ALIGNMENT_SIZINGS = {
	//TODO: add horizontal sizing
	[VERTICAL]: {
		[MATCH_SIDE] ({width}) {
			return {
				width: width
			};
		},
		[DEFAULT_SIZING] () {
			return {};
		}
	}
};
