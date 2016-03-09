var webpack = require('webpack');
var ExtractTextPlugin = require ('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

var production = JSON.parse(process.env.NODE_ENV || 'false');
var devTools = production ? 'source-map' : 'cheap-inline-module-source-map';

module.exports = {
    entry: {
        main: './js/main',
        react: ['react']
    },
    devtool: devTools,
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/build',
        filename: 'js/bundle.[hash].js',
        library: '[name]'   
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx'],
    },
    module: {
        loaders: [
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?name=../fonts/[name].[ext]&limit=10000&mimetype=application/font-woff" 
            },
            { 
                test: /\.(ttf|eot|svg|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: 'file?name=../fonts/[name].[ext]'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("css-loader")
            },

            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass')
            },
            {
                test: /(\.jsx$)|(\.js$)/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            }
        ]
    },

    devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: path.join(__dirname, 'backend')
    },

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'react',
            filename: 'js/react.js'
        }),
        new ExtractTextPlugin('style/style.[hash].min.css', { allChunks: true }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
        new HtmlWebpackPlugin({
            title: 'Events',
            filename: '../backend/index.html',
            template: './backend/template.html'
        })
        //new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
}
    