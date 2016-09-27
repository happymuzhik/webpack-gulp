const webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var js_directory = './work_directory/js/';
var css_directory = './work_directory/css/';

module.exports = {
	// watch: true, // для автоматического сохранения, можно также указфывать при запуске вебпака - webpack --watch
    entry: "./"+js_directory+"entry.js",
    output: {
        filename: js_directory+"bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },            
            // {
            //     test: /\.styl$/,
            //     exclude: /node_modules/,
            //     loader: 'style-loader!css-loader!stylus-loader'  //настройки для добавления стиля сразу на страничку
            // },
            {
                test: /\.styl$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader') // для выгрузки стилей в отделный файл
            },
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new ExtractTextPlugin(css_directory+"style.css"),   // для выгрузки стилей в отделный файл      
    ]
};



// http://webpack.github.io/docs/list-of-plugins.html Список плагинов