const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const resolveAppVersion = require('./scripts/resolveAppVersion');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const globalSCSS = path.resolve(__dirname, 'src/styles/_global.scss');
const dist = path.resolve(__dirname, 'dist');
const src = path.resolve(__dirname, 'src');
const app = path.resolve(src, 'app');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',

    entry: {
        'bundle': './src/index.js',
        'push': './src/sw/push.ts'
    },

    output: {
        path: dist,
        filename: '[name].js',
        globalObject: `(() => {
            if (typeof self !== 'undefined') {
                return self;
            } else if (typeof window !== 'undefined') {
                return window;
            } else if (typeof global !== 'undefined') {
                return global;
            } else {
                return Function('return this')();
            }
        })()`
    },

    devServer: {
        port: 3000,
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
                loader: 'svg-inline-loader'
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
                test: /\.module\.(scss|sass|css)$/,
                include: app,
                use: [
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
                'VERSION': JSON.stringify(resolveAppVersion()),
                'BUILD_DATE': JSON.stringify(Date.now()),
                // 'API_WEBSOCKET': JSON.stringify('ws://localhost:8080'),
                // 'API_HTTP': JSON.stringify('http://localhost:8080'),
                'API_WEBSOCKET': JSON.stringify('ws://192.168.178.49:8080'),
                'API_HTTP': JSON.stringify('http://192.168.178.49:8080')
            }
        }),

        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true
        }),

        new CopyPlugin({
            patterns: [
                {context: 'src', from: 'assets'}
            ]
        }),

        new ProgressBarPlugin()
    ]
};
