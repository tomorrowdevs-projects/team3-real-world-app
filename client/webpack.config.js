const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/javascript/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    filename: "bundle.js",
    // Define the output path for images
    assetModuleFilename: 'img/[hash][ext][query]'
  },

  devServer: {
    static: "./dist",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      // for webpack 5 use asset/resource instead of file-loader or url-loader
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },

  mode: "development",

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      inject: "body",
    }),
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/assets/img",
          to: "./img",
        },
      ],
    }),
  ],
};
