const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    form: './src/frontend/form.js',
    formList: './src/frontend/form_list.js',
    editForm: './src/frontend/edit_form.js',
    showForm: './src/frontend/show_form.js',
    formResponse: './src/frontend/form_response.js',
    

  },
  output: {
    path: path.resolve(__dirname, 'public/vue'),
    filename: '[name].bundle.js',
    publicPath: '/public/vue/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        //loader: 'babel-loader',
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
      },
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm-bundler.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'public/vue'),
    publicPath: '/public/vue/',
    port: 3001
  }
};