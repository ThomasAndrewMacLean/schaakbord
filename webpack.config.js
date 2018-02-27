const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

// var extractPlugin = new ExtractTextPlugin({
//     filename: 'main.css'
// });

module.exports = {
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

    plugins: [new HTMLPlugin({
        template: 'index.html',
        filename: 'index.html'
    }),
    new CleanWebpackPlugin(['dist'])
    ]


};