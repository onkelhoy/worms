module.exports = function (default_config) {
  let config = default_config

  config.mode = 'development'
  config.devServer = {
    publicPath: config.output.publicPath
  }
  config.devtool = 'source-map'

  return config
}