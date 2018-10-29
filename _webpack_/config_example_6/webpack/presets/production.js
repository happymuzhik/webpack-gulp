const parts = require('./../parts');
const merge = require('webpack-merge');
const baseConfig = require('./base');

module.exports = function (env) {
  const config = merge([
    parts.entry({hotReload: false}),
    parts.output({optimize: true}),
    parts.scripts({sourceMaps: false, optimize: true}),
    parts.styles({optimize: true}),
    parts.indexTemplate()
  ]);

  return merge([baseConfig(env), config]);
};
