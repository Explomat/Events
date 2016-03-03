var ExtractTextPlugin = require ('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
    entry: './js/main',
    devtool: 'source-map',
    output: {
        path: '\\\\10.1.20.67\\c$\\WebSoft\\WebTutorServer\\wt\\web\\react\\events_test\\build\\js',
        filename: 'bundle.js'   
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx'],
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },

            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'sass-loader')
            },
            {
                test: /\.jsx$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
                query: {
                  presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.min.css', 'style.min.css')
    ]
}
    