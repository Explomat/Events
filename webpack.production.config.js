var webpack = require('webpack');
var ExtractTextPlugin = require ('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
    entry: {
        main: './js/main',
        react: ['react']
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'js/bundle.js',
        library: '[name]'   
    },
    resolve: {
        root: [
            path.resolve(__dirname, 'js'),
        ],
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx'],
    },
    module: {
        preLoaders: [
            {
                test: /(\.js$)|(\.jsx$)/,
                loaders: ['eslint'],
                include: [
                  path.resolve(__dirname, "js"),
                ],
            }
        ],
        loaders: [
            { 
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff" 
            },
            { 
                test: /\.(ttf|eot|svg|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                loader: 'file?name=fonts/[name].[ext]'
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
                loaders: ['react-hot', 'babel-loader'],
                include: path.join(__dirname, 'js/components')
            },
            {
                test: /\.js$/,
                loader: 'babel',
                include: path.join(__dirname, 'js'),
                exclude: path.join(__dirname, 'js/components')
            }
        ]
    },

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'react',
            filename: 'js/react.js'
        }),
        new ExtractTextPlugin('style/style.min.css', { allChunks: true }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
        new webpack.optimize.UglifyJsPlugin({ mangle: false })
    ]
}

    