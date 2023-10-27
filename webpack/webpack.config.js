const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    entry: {
        app: './src/main.tsx'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
        {
            test: /\.css|sass|scss$/,
            use: [{loader:MiniCssExtractPlugin.loader},'css-loader','sass-loader']
        },
        {
            test: /\.js|jsx|tsx$/,
            exclude: /(node_module)/,
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env','@babel/preset-react']
            },
        },
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_module/,
            include: [path.resolve("./src")],
            use: {
                loader: 'ts-loader'
            }
        },
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            exclude: /node_modules/,
            include: [path.resolve("./src/assets/images")],
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    esModule: false,
                }
            }],
            type: 'javascript/auto'
        }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './public/index.html' }),
        new MiniCssExtractPlugin()
    ],
    devServer: {
        port: 8000,
        open: true
    },
    mode: 'development'
}