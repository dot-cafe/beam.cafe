const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const resolveAppVersion = require('./scripts/resolveAppVersion');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkBoxPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const globalSCSS = path.resolve(__dirname, 'src/styles/_global.scss');
const dist = path.resolve(__dirname, 'dist');
const src = path.resolve(__dirname, 'src');
const app = path.resolve(src, 'app');
require('dotenv').config();

require('dotenv');
module.exports = {
    mode: 'production',

    entry: {
        'bundle': './src/index.js',
        'push': './src/sw/push.ts'
    },

    output: {
        path: dist,
        filename: 'js/[name].js',
        publicPath: '/'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.scss'],
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
            'mobx': path.join(__dirname, '/node_modules/mobx/lib/mobx.es6.js'),
            '@state': path.resolve('./src/state'),
            '@utils': path.resolve('./src/utils'),
            '@overlays': path.resolve('./src/app/overlays'),
            '@components': path.resolve('./src/app/components')
        }
    },

    module: {
        rules: [
            {
                test: /\.woff2$/i,
                use: 'file-loader'
            },
            {
                test: /\.svg$/,
                loader: [
                    'svg-inline-loader',
                    'svgo-loader'
                ]
            },
            {
                enforce: 'pre',
                test: /\.s[ac]ss$/,
                use: [
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            additionalData: '@import "src/styles/_variables.scss";',
                            sassOptions: {
                                includePaths: [globalSCSS]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.module\.(sc|sa|c)ss$/,
                include: app,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[hash:base64:5]'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(sc|sa|c)ss$/,
                exclude: app,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.[jt]sx?$/,
                include: src,
                use: 'babel-loader'
            }
        ]
    },

    optimization: {
        minimize: true,
        splitChunks: {
            minChunks: 3
        },
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    toplevel: true,
                    mangle: true,
                    output: {
                        comments: /^!/
                    }
                }
            })
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'env': {
                'NODE_ENV': JSON.stringify('production'),
                'VERSION': JSON.stringify(resolveAppVersion()),
                'BUILD_DATE': JSON.stringify(Date.now()),
                'API_WEBSOCKET': JSON.stringify(process.env.API_WEBSOCKET || 'wss://beam.cafe/ws'),
                'API_HTTP': JSON.stringify(process.env.API_HTTP || 'https://beam.cafe')
            }
        }),

        new HtmlWebpackPlugin({
            chunks: ['bundle'],
            filename: 'index.html',
            template: 'public/index.html',
            inject: true,
            minify: {
                minifyCSS: true,
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        }),

        new MiniCssExtractPlugin({
            chunkFilename: 'css/bundle.css',
            filename: 'css/bundle.css'
        }),

        new WorkBoxPlugin.GenerateSW({
            importScripts: ['js/push.js'],
            swDest: 'sw.js',
            clientsClaim: true,
            skipWaiting: true
        }),

        new CopyPlugin({
            patterns: [
                {context: 'src', from: 'assets'}
            ]
        }),

        // new BundleAnalyzerPlugin(),
        new ProgressBarPlugin(),
        new CleanWebpackPlugin()
    ]
};
