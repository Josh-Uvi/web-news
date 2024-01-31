const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
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

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.(css)$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true, importLoaders: 2, modules: false },
          },
        ],
      },
    ],
  },
  devServer: {
    static: "./dist",
    port: PORT,
    host: HOST,
    onListening: function (devServer) {
      if (!devServer) {
        throw new Error("webpack-dev-server is not defined");
      }
      devServer.app.use("/api", apiProxy);
    },
  },
});
