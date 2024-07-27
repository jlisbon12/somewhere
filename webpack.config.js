const chokidar = require("chokidar");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

// Use chokidar to watch files
const watcher = chokidar.watch("./src", {
  ignored: /node_modules/,
  persistent: true,
});

watcher.on("change", (path) => {
  console.log(`File ${path} has been changed`);
  // Do something with the changed file
});

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Customize the config before returning it
  config.module.rules.push({
    test: /\.(ttf|woff|woff2|eot|otf)$/,
    loader: "file-loader",
    options: {
      name: "[name].[hash].[ext]",
      outputPath: "static/fonts",
    },
  });

  // Add watchOptions to Webpack configuration
  config.watchOptions = {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  };

  return config;
};
