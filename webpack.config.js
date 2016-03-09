var webpack = require('webpack');
var ExtractTextPlugin = require ('extract-text-webpack-plugin');
var path = require('path');

var production = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
    entry: {
        main: './js/main',
        react: ['react']
    },
    devtool: 'cheap-inline-module-source-map',
    output: {
        path: 'build/js',
        filename: './bundle.js'   
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
                test: /\.jsx$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'react',
            filename: 'react.js'
        }),
        new ExtractTextPlugin('../style/style.min.css', { allChunks: true }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/)
        //new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
}
    