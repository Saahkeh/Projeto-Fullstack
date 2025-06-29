const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // ponto de entrada
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/', // importante para SPA com historyApiFallback
    clean: true
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    historyApiFallback: true, // permite navegação em SPA
    open: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // JS e JSX
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/, // CSS
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ]
};

