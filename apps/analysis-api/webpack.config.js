const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: slsw.lib.entries,
    target: 'node',
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    optimization: {
        minimize: false
    },
    performance: {
        hints: false
    },
    devtool: 'source-map',
    externals: [nodeExternals()],
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['node_modules']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.app.json'
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '.webpack'),
        libraryTarget: 'commonjs2'
    }
}; 