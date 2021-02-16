import { createDOM } from '@nti/lib-dom';

import { getMirrorStyles } from './utils';

const getBody = () => (typeof document !== 'undefined' ? document.body : null);

const containerConfig = {
	style: {
		position: 'absolute',
		left: 0,
		bottom: 0,
		height: 0,
		'pointer-events': 'none',
		border: 'none',
		overflow: 'hidden',
		padding: '0',
		visibility: 'hidden',
	},
};

export default class ScratchPad {
	static mirrorStyles(node, styles) {
		return new ScratchPad({ style: getMirrorStyles(node, styles) });
	}

	static withStyles(style) {
		return new ScratchPad({ style });
	}

	static work(...args) {
		const pad = new ScratchPad();

		return pad.work(...args);
	}

	#scratchPad = null;
	#config = null;
	#container = null;
	#node = null;

	constructor(config = {}) {
		this.#config = config;
	}

	#createNode = () => {
		if (this.#node) {
			return this.#node;
		}

		const body = getBody();

		if (!body) {
			throw new Error('Cannot use scratch bad without a body');
		}

		this.#container = createDOM(containerConfig, body);
		this.#node = createDOM(this.#config, this.#container);

		return this.#node;
	};

	#removeNode = () => {
		const body = getBody();

		if (!body) {
			return;
		}
		if (this.#container) {
			body.removeChild(this.#container);
		}
	};

	async work(fn) {
		const node = this.#createNode();

		try {
			await fn(node);
		} finally {
			this.#removeNode();
		}
	}
}
