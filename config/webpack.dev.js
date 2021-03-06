const Webpack = require('webpack');
const { resolve } = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: "development",
  devtool: 'source-map',//eval-source-map
  entry: {
     app: ['./src/index.js']
  },
  output: {
    path: resolve(__dirname, '../build'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath:'/'
  },
  module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                exclude: /node_modules/,
                use: [
                      {
                          loader: "babel-loader",
                          options:{
                            cacheDirectory:true//缓存
                          }
                      },
                      // {
                      //   loader:'eslint-loader',//检查规则eslint.config.js
                      //   options:{
                      //     cache: true
                      //   }
                      // }
                ]
            },
            {
              test: /\.(png|jpg|gif)$/,
              exclude: /node_modules/,
              use: [
                // {
                //   loader: 'file-loader',
                //   options: {
                //     name: '[path][name].[ext]'
                //   }
                // },
                {
                  loader: 'url-loader',
                  options: {
                    limit: 8*1024,
                    // esModule:true,
                    name:'[hash:10].[ext]'
                  }
                }
              ]
            },
            {
                test: /\.css$/,
                include: resolve(__dirname, "../src"),
                use: [
                    {
                       loader: MiniCssExtractPlugin.loader,
                       options: {
                         //publicPath: '../',
                         // esModule: true,
                         // only enable hot in development
                         hmr: isDev,
                         // if hmr does not work, this is a forceful method.
                         reloadAll: true
                       }
                    },
                    {
                      loader: 'css-loader',
                      options: {
                          modules: true,
                          sourceMap:true,
                          importLoaders: 1
                      }
                    },
                    { loader: 'postcss-loader' }
                ]
            },
            {
                test:/\.(ttf|woff|woff2|eot|svg)$/,
                exclude:/node_modules/,
                loader:'file-loader',
                options:{
                    name:'[hash:10].[ext]'
                }
            },
            {
                test:/\.css$/,
                include:/[\\/]node_modules[\\/](antd)[\\/]/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Hello World',
        template:'./public/index.html',
        filename: "index.html",
        favicon: "./public/favicon.ico"
      }),
      new CleanWebpackPlugin(),
      new Webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name]-[hash].css',
        chunkFilename: '[id]-[hash].css',
        ignoreOrder: false
      }),

      //new BundleAnalyzerPlugin() //打包调整优化
    ],
    optimization: {
      splitChunks: {
          chunks: "async",
          minSize: 30000,
          minChunks: 1,
          maxAsyncRequests: 8,
          maxInitialRequests: 5,
          automaticNameDelimiter: '-',
          name: true,
          cacheGroups: {
          vendor: {
            //第三方依赖
            priority: 1,
            name: 'vendor',
            test: /node_modules/,
            chunks: 'initial',
            minSize: 100,
            minChunks: 1 //重复引入了几次
          },
          lodash: {
            name: "lodash", //单独将lodash拆包
            priority: 5, // 权重需大于`vendor`
            test: /[\\/]node_modules[\\/](lodash)[\\/]/,
            chunks: 'initial',
            minSize: 100,
            minChunks: 1
          },
          react: {
            name: "react",
            priority: 5, // 权重需大于`vendor`
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            chunks: 'initial',
            minSize: 100,
            minChunks: 1
          },
          antd: {
            name: "antd",
            priority: 5, // 权重需大于`vendor`
            test: /[\\/]node_modules[\\/](antd)[\\/]/,
            chunks: 'initial',
            minSize: 100,
            minChunks: 1
          },
          moment: {
            name: "moment",
            priority: 5, // 权重需大于`vendor`
            test: /[\\/]node_modules[\\/](moment)[\\/]/,
            chunks: 'initial',
            minSize: 100,
            minChunks: 1
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
   devServer: {
      contentBase: resolve(__dirname, "../build"),
      historyApiFallback: true,
      host:"127.0.0.1",
      port: 9000,
      inline: true,
      hot: true
      // proxy: {
      //    '/api': {
      //      target: 'http://192.168.23.213:8080',
      //      pathRewrite: {'^/api' : ''}
      //    }
      //  }
    }
}
