const webpack = require('webpack')

module.exports = function (default_config) {
  let config = default_config

  config.mode = 'development'
  config.devServer = {
    publicPath: config.output.publicPath
  }
  config.devtool = 'source-map'
  config.watchOptions = {
    poll: true,
    ignored: /node_modules/
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())

  return config
}