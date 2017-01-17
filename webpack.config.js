const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const root = path.resolve(__dirname, 'src');
const testRoot = path.resolve(__dirname, 'test');
const isRoot = (e) => e.startsWith(root) || e.startsWith(testRoot);

exports = module.exports = {
	entry: './src/index.js',
	output: {
		path: 'lib/',
		filename: 'index.js',
		library: true,
		libraryTarget: 'commonjs2'
	},

	devtool: 'source-map',

	node: {
		global: false
	},

	target: 'web',

	resolve: {
		extensions: ['', '.jsx', '.js']
	},


	externals: [
		// Every non-relative module is external
		// abc -> require("abc")
		/^[a-z\-0-9]+/i
	],


	postcss: [
		autoprefixer({ browsers: ['> 1%', 'last 2 versions'] })
	],


	sassLoader: {
		sourceMap: true
	},


	module: {
		preLoaders: [
			{
				test: /src.+jsx?$/,
				loader: 'baggage?[file].scss',
				include: isRoot
			}
		],
		loaders: [
			{
				test: /\.js(x?)$/,
				include: isRoot,
				loader: 'babel',
				query: {
					sourceMaps: true
				}
			},

			{ test: /\.json$/, loader: 'json' },

			{
				test: /\-avatar.png$/,
				loader: 'url',
				query: {
					mimeType: 'image/[ext]'
				}
			},

			{
				test: /\.template\.svg$/,
				loader: 'raw-loader'
			},

			{
				test: /\.(ico|gif|png|jpg|svg)$/,
				exclude: [/\-avatar.png$/, /.template.svg$/],
				loader: 'url',
				query: {
					limit: 500,
					name: 'assets/[name]-[hash].[ext]',
					mimeType: 'image/[ext]'
				}
			},

			{ test: /\.(s?)css$/, loader: ExtractTextPlugin.extract(
				'style-loader',
				'css?sourceMap&-minimize!postcss!resolve-url!sass'
				)
			}
		]
	},

	plugins: [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('index.css', {allChunks: true})
	].filter(x => x)
};
