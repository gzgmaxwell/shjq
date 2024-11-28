module.exports = {
  configureWebpack: {
    devtool: "source-map",
    performance: {
      hints: false,
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      },
    },
  },
  //解决打包后出现空白的问题
  publicPath: "./",
  devServer: {
    proxy: {
      "/web_api": {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        onProxyReq(proxyReq, req, res) {
          proxyReq.setHeader("X-Admin-Request", "web");
        },
        pathRewrite: {
          "^/web_api": "",
        },
      },
    },
  },
};
