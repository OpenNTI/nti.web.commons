import {
	DEFAULT_SIZING,
	VERTICAL,
	MATCH_SIDE,
} from '../Constants';


const ALIGNMENT_SIZINGS = {
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

export default ALIGNMENT_SIZINGS;
