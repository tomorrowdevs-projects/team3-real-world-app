const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/javascript/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    filename: "bundle.js",
  },

  devServer: {
    static: "./dist",
  },

  mode: "development",

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
};
