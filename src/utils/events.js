import {EventEmitter} from 'events';

const EMITTER = new EventEmitter();

export default function getEmitter () {
	return EMITTER;
}
