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
const apiKey = process.env.API_KEY;
const apiUrl = process.env.API_URL;

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
  entry: "./public/entry.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        loader: "url-loader",
        options: { limit: false },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
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
