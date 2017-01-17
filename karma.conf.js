const baseConfig = require('nti-unittesting-clientside');

module.exports = function (config) {
	const {webpack} = baseConfig;
	webpack.resolve.root = void 0;
	webpack.externals = Object.assign(webpack.externals || {}, {
		'cheerio': 'window',
		'react/addons': true,
		'react/lib/ExecutionEnvironment': true,
		'react/lib/ReactContext': true
	});

	webpack.module.loaders.unshift({
		test: /template\.svg$/,
		loader: 'raw-loader'
	});

	config.set(Object.assign(baseConfig, {
		files: [
			'test/helpers/**/*.js',
			'test/*.js'
		],

		preprocessors: {
			'test/**/*.js': ['webpack', 'sourcemap']
		}
	}));
};
