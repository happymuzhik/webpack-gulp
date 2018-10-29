const util = require('util');

module.exports = env => {

  const exportConfigFor = (env) => {
    if(env.development) {
      return require('./webpack/presets/development.js')(env);
    }

    if(env.production) {
      return require('./webpack/presets/production.js')(env);
    }
  };

  console.log(util.inspect(exportConfigFor(env), {showHidden: false, depth: null}));

  return exportConfigFor(env);
};
