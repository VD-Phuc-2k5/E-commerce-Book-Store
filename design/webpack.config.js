const path = require("path");

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    historyApiFallback: true,
    port: 3000,
    open: true,
  },
  mode: "development",
};
