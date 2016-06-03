exports = module.exports = Object.assign(require('./webpack.config'), {
	entry: './test/app/index.js',
	externals: [],
	output: {
		path: '/',
		filename: 'index.js',
		publicPath: '/'
	}
});

exports.module.loaders.push({
	test: /\.(eot|ttf|woff)$/,
	loader: 'file-loader',
	query: {
		name: 'assets/fonts/[name]-[hash].[ext]'
	}
});
