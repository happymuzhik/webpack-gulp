const webpack = require('webpack');
const path = require('path');

const paths = require('./paths');
const restConfig = require('./rest-config');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

exports.entry = function ({hotReload}) {
  const entry = {
    app: [paths.appIndex]
  };

  const plugins = [
    new webpack.optimize.ModuleConcatenationPlugin()
  ];

  if (hotReload) {
    entry.app.unshift('react-hot-loader/patch');
    plugins.push(new webpack.NamedModulesPlugin())
  }
  entry.app.unshift('babel-polyfill');
  return {entry, plugins}
};

exports.output = function ({optimize}) {
  const output = {
    path: paths.dist,
    filename: 'bundles/[name].bundle.js',
    publicPath: '/'
  };


  if (optimize) {
    output.filename = 'bundles/[name].[chunkhash].bundle.js';
  }

  return {output};
};

exports.scripts = function ({sourceMaps, optimize}) {
  const result = {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                sourceMap: sourceMaps,
                plugins: [
                  'transform-class-properties',
                  'babel-plugin-transform-object-rest-spread',
                  'react-hot-loader/babel'
                ],
                presets: [
                  'react',
                  ["env", {
                    "targets": {
                      "browsers": ["last 2 versions"]
                    },
                    "modules": false
                  }]
                ]
              }
            }
          ]
        }
      ]
    }
  };

  if (optimize) {
    result.plugins = [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: sourceMaps,
        compress: {warnings: false}
      })
    ];
  }

  return result;
};

exports.styles = function ({optimize}) {
  const cssLoaderWithModules = {
    loader: 'css-loader',
    options: {
      modules: true,
      camelCase: true,
      localIdentName: '[local]___[hash:base64:5]'
    }
  };

  if (optimize) {
    return {
      module: {
        rules: [
          {
            test: /\.less$/,
            include: [paths.js],
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                  {
                    loader: 'css-loader',
                    options: {
                      modules: true,
                      camelCase: true,
                      localIdentName: '[local]___[hash:base64:5]',
                      minimize: true
                    }
                  },
                  'less-loader?root=true'
                ]
              }
            )
          },
          {
            test: /\.less$/,
            exclude: [paths.js],
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'less-loader?root=true']
              }
            )
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: "css/[name].[contenthash].css",
          disable: false,
          allChunks: true
        })
      ]
    };
  }

  return {
    module: {
      rules: [
        {
          test: /\.less$/,
          include: [paths.js],
          use: ['style-loader', cssLoaderWithModules, 'less-loader?root=true']
        },
        {
          test: /\.less$/,
          exclude: [paths.js],
          use: [
            'style-loader',
            'css-loader',
            'less-loader?root=true'
          ]
        }
      ]
    }

  };
};

exports.file = function () {
  return {
    module: {
      rules: [
        {test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)/, loader: 'file?name=[path][name].[ext]'},
      ]
    }
  };
};

exports.devServer = function () {
  return {
    devServer: {
      open: true,
      compress: true,
      port: 3000
    }
  };
};

exports.indexTemplate = function () {
  const options = {
    inject: false,
    chunks: ['vendor', 'app'],
    template: paths.mainTemplate,
    filename: 'index.html'
  };

  return {
    plugins: [
      new HtmlWebpackPlugin(options)
    ]
  };
};

exports.esLint = function () {
  return {
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "eslint-loader",
          options: {
            failOnError: true
          }
        }
      ]
    }
  }
};

exports.resolveLoaders = function () {
  return {
    resolveLoader: {
      moduleExtensions: ["-loader"]
    }
  };
};

exports.resolve = function () {
  return {
    resolve: {
      modules: [
        paths.nodeModules,
      ],
      extensions: ['.js', '.less']
    }
  };
};

exports.commonChunks = function () {
  return {
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        //If the current imported file is in 'node_modules' move it to the common chunk
        minChunks (module) {
          return module.context &&
            module.context.indexOf('node_modules') >= 0;
        }
      })
    ]
  };
};

exports.defineConstants = function (env) {
  const consts = {};

  if (env.production) {
    consts['REST_ROOT'] = env.local
      ? JSON.stringify(restConfig['production:local'].restRoot)
      : JSON.stringify(restConfig['production'].restRoot);

    consts['process.env.NODE_ENV'] = JSON.stringify('production');
  } else if (env.development) {
    consts['REST_ROOT'] = JSON.stringify(restConfig['development'].restRoot)
  }

  return {
    plugins: [
      new webpack.DefinePlugin(consts)
    ]
  };
};

exports.clean = function () {
  return {
    plugins: [
      new CleanWebpackPlugin(['dist'], paths.root)
    ]
  }
};

exports.bundleAnalyzer = function () {
  return {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html',
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: 'stats.json'
      })
    ]
  };
};
