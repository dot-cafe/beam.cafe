const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkerPlugin = require('worker-plugin');
const webpack = require('webpack');
const pkg = require('./package');
const path = require('path');

const dist = path.resolve(__dirname, 'dist');
const src = path.resolve(__dirname, 'src');
const app = path.resolve(src, 'app');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    devtool: 'inline-source-map',

    output: {
        path: dist,
        filename: '[name].js'
    },

    devServer: {
        port: 3003,
        disableHostCheck: true,
        historyApiFallback: true,
        clientLogLevel: 'none',
        stats: 'errors-only',
        quiet: true,
        host: '0.0.0.0',
        liveReload: false,
        overlay: false,
        inline: true,
        hot: true
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.scss'],
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat'
        }
    },

    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                enforce: 'pre',
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            prependData: '@import "src/styles/_global.scss";'
                        }
                    }
                ]
            },
            {
                test: /\.module\.(scss|sass|css)$/,
                include: app,
                use: [
                    'css-hot-loader',
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]__[name]'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(scss|sass|css)$/,
                exclude: app,
                use: [
                    'css-hot-loader',
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(js|ts|tsx)$/,
                include: src,
                use: 'babel-loader'
            }
        ]
    },

    optimization: {
        splitChunks: {
            minChunks: 3
        }
    },

    plugins: [
        new webpack.DefinePlugin({
            'env': {
                'NODE_ENV': JSON.stringify('development'),
                'VERSION': JSON.stringify(pkg.version),
                'BUILD_DATE': JSON.stringify(Date.now()),
                'WS_ENDPOINT': JSON.stringify('ws://localhost:8080'),
                'API_ENDPOINT': JSON.stringify('http://localhost:8080')
            }
        }),

        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true
        }),

        new CopyPlugin([{
            context: 'src',
            from: 'assets'
        }]),

        new WorkerPlugin({
            globalObject: 'self'
        }),

        new ProgressBarPlugin()
    ]
};
