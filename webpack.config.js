const CleanWebpackPlugin = require('clean-webpack-plugin');
const VersionFile = require('webpack-version-file');
const HTMLPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

// var extractPlugin = new ExtractTextPlugin({
//     filename: 'main.css'
// });

module.exports = env => {

    // env.SERVER_URL = 'http://localhost:8080';

    return {
        entry: './src/js/app.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            // publicPath: '/dist'
        },
        module: {
            rules: [{
                test: /\.scss$/,

                use: ['style-loader', 'css-loader', 'sass-loader']

            }]
        },

        plugins: [
            new HTMLPlugin({
                template: 'index.html',
                filename: 'index.html'
            }),
            new CleanWebpackPlugin(['dist']),
            new CopyWebpackPlugin([{
                from: 'sw'
            }]),
            new VersionFile()
        ]


    };
};