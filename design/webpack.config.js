const path = require("path");

module.exports = {
  entry: "./src/app.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    historyApiFallback: true,
    port: 3000,
  },
  mode: "development",
};
