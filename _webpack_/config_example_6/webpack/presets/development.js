const parts = require('./../parts');
const merge = require('webpack-merge');
const baseConfig = require('./base');

module.exports = function (env) {
  const config = merge([
    {
      devtool: 'cheap-module-source-map'
    },
    parts.entry({hotReload: true}),
    parts.output({optimize: false}),
    parts.indexTemplate(),
    parts.scripts({sourceMaps: true, optimize: false}),
    parts.devServer(),
    parts.esLint(),
    parts.styles({optimize: false})
  ]);

  return merge([baseConfig(env), config]);
};
