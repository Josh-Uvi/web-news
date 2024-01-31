const path = require("path");
require("dotenv").config({ path: "./.env" });
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const { createProxyMiddleware } = require("http-proxy-middleware");

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";
const apiKey = process.env.API_KEY || "";
const apiUrl = process.env.API_URL || "";

const simpleRequestLogger = (proxyServer, options) => {
  proxyServer.on("proxyReq", (proxyReq, req, res) => {
    console.log(`[HPM] [${req.method}] ${req.url}`); // outputs: [HPM] GET /users
  });
};

const apiProxy = createProxyMiddleware({
  target: apiUrl,
  changeOrigin: true,
  pathRewrite(pathReq, req) {
    const pathname = pathReq.split("?")[0];
    let url = `${pathname}?`;
    url = Object.entries(req.query).reduce(
      (newUrl, [key, value]) => `${newUrl}&${key}=${encodeURI(value)}`,
      url
    );
    return url;
  },
  headers: {
    Authorization: apiKey,
  },
  plugins: [simpleRequestLogger],
});

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
    assetModuleFilename: "images/[hash][ext][query]",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/, // JavaScript
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg|gif)$/, // to import images and fonts
        loader: "url-loader",
        options: { limit: 8192 },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv(),
    new HtmlWebpackPlugin({
      title: "World News",
      template: path.resolve(__dirname, "./src/template.html"), // template file
      favicon: path.resolve(__dirname, "./src/assets/favicon.ico"),
      filename: "index.html", // output file
    }),
    new MiniCssExtractPlugin(),
    new MomentLocalesPlugin(),
  ],
  devServer: {
    port: PORT,
    host: HOST,
    onListening: function (devServer) {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }
      devServer.app.use("/api", apiProxy);
    },
  },
};
