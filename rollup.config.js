/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import string from 'rollup-plugin-string';
import image from 'rollup-plugin-image';

const pkg = require('./package.json');

export default {
	entry: 'src/index.js',
	format: 'es',
	dest: 'lib/index.js',
	sourceMap: true,
	exports: 'named',
	external: [
		...Object.keys(pkg.dependencies),
		...Object.keys(pkg.devDependencies),
		'events',
		'path',
		'url',
		'eases/cubic-out',
		'react-router-component/lib/environment/LocalStorageKeyEnvironment',
		'react-transition-group/CSSTransitionGroup',
	],
	plugins: [
		resolve({
			extensions: [ '.js', '.jsx', '.json' ],
			modulesOnly: true,
		}),
		babel({ exclude: 'node_modules/**' }),
		json(),
		string({
			include: '**/*.svg',
		}),
		image()
	]
};
