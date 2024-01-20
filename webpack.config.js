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
// const apiKey = process.env.API_KEY;
// const apiUrl = process.env.API_URL;

// const apiProxy = createProxyMiddleware({
//   target: apiUrl,
//   changeOrigin: true,
//   pathRewrite(_, req) {
//     let url = req.originalUrl;
//     url = Object.entries(req.query).reduce(
//       (newUrl, [key, value]) => `${newUrl}&${key}=${encodeURI(value)}`,
//       url
//     );
//     return url;
//   },
//   headers: {
//     Authorization: apiKey,
//   },
// });

const simpleRequestLogger = (proxyServer, options) => {
  proxyServer.on("proxyReq", (proxyReq, req, res) => {
    console.log(`[HPM] [${req.method}] ${req.url}`); // outputs: [HPM] GET /users
  });
};

const apiProxy = createProxyMiddleware({
  target: "http://localhost:8888/api/",
  changeOrigin: true,
  pathRewrite: { "^/\\.netlify/functions": "" },
  plugins: [simpleRequestLogger],
});

module.exports = {
  entry: "./public/entry",
  output: {
    path: path.join(__dirname, "/dist"),
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
