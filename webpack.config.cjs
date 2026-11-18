const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = (_, argv) => {
  const isProduction = argv.mode === "production";
  return {
    mode: argv.mode || "development",

    entry: path.resolve(__dirname, "src/main.tsx"),

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "assets/[name].[contenthash].js",
      clean: true,
      publicPath: isProduction ? "./" : "/",
    },

    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: "ts-loader",
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: "asset/resource",
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "index.html"),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public/tasks.json"),
            to: "tasks.json",
          },
        ],
      }),
    ],

    devServer: {
      static: {
        directory: path.resolve(__dirname, "public"),
      },
      port: 3000,
      hot: true,
      historyApiFallback: true,
    },
  };
};
