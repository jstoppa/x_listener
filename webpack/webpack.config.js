const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
	mode: 'production',
	entry: {
		content_script: './src/apps/content_script.ts',
		popup: './src/apps/popup.ts',
		web_accessible: './src/apps/web_accessible.ts',
	},
	output: {
		path: path.join(__dirname, '../dist'),
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: '.', to: '.', context: 'public' }],
		}),
		new CleanWebpackPlugin(),
	],
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true,
					},
					mangle: true,
				},
			}),
		],
	},
};
