const webpack = require('webpack')
const path = require('path')

const config = {
  entry: {
    game: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      './src/game.js'
    ],
    menu: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      './src/menu.js'
    ],
    lobby: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      './src/lobby.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'js/[name].bundle.js',
    publicPath: '/'
  },

  module: {
    rules: [
      { exclude: /node_modules/, test: /\.s?css$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { exclude: /node_modules/, test: /\.js$/, use: 'babel-loader' },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: ['html-loader', 'pug-html-loader']
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

// exporting based on mode 
if (process.env.MODE === 'dev')
  module.exports = require('./config/webpack.dev')(config)
else
  module.exports = require('./config/webpack.prod')(config)