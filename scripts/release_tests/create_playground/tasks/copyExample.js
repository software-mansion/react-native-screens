const fs = require('fs');
const path = require('path');
const { EMPTY_TEMPLATE } = require('../config');

function copyExample(config, { runTask }) {
  if (config.template === EMPTY_TEMPLATE) {
    console.log(`🔍 Selected empty template. Skipping...\n`);
    return;
  }

  runTask(
    'Copying template App file and src directory',
    config.paths.log,
    () => {
      const templateDir = path.join(
        config.paths.templates,
        config.template,
      );

      const sourceAppFile = path.join(templateDir, 'App.tsx');
      const targetAppFile = path.join(config.paths.app, 'App.tsx');

      fs.copyFileSync(sourceAppFile, targetAppFile);

      const sourceSrcDir = path.join(templateDir, 'src');
      const targetSrcDir = path.join(config.paths.app, 'src');

      if (fs.existsSync(sourceSrcDir)) {
        fs.cpSync(sourceSrcDir, targetSrcDir, { recursive: true, force: true });
      }
    },
  );
}

module.exports = copyExample;
