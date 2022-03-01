const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/javascript/index.js",
    // upload: "./src/javascript/upload.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    filename: "[name].js",
    // Define the output path for images
    assetModuleFilename: "img/[hash][ext][query]",
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
      filename: "index.html",
      template: "index.html",
      inject: "body",
      chunks: ["index"],
      // chunks: ["index", "upload"],
    }),
    // new HtmlWebpackPlugin({
    //   filename: "upload.html",
    //   template: "upload.html",
    //   inject: "body",
    //   chunks: ["index", "upload"],
    // }),
    new MiniCssExtractPlugin({
      filename: "bundle.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/assets/img",
          to: "./img",
        },{
          from: path.resolve(__dirname, "auth_config.json")
        }
      ],
    }),
  ],
};
