const path = require('path');
const root = path.join(__dirname, '../');
const src = path.join(root, 'src');
const js = path.join(src, 'js');

const paths = {
  root,
  js,
  dist: path.join(root, 'dist'),
  appIndex: path.join(src, 'index.js'),
  mainTemplate: path.join(src, 'index.ejs'),
  nodeModules: path.join(root, 'node_modules')
};

module.exports = paths;
