const fs = require('fs');
const path = require('path');

function copyExample(config, { runTask }) {
  if (config['example-app'] === 'empty') {
    console.log(`🔍 Selected empty example app. Skipping...\n`);
    return;
  }

  runTask(
    'Copying example App file and src directory',
    config.paths.log,
    () => {
      const exampleDir = path.join(
        config.paths.releaseTests,
        'examples',
        config['example-app'],
      );

      const sourceAppFile = path.join(exampleDir, 'App.tsx');
      const targetAppFile = path.join(config.paths.app, 'App.tsx');

      fs.copyFileSync(sourceAppFile, targetAppFile);

      const sourceSrcDir = path.join(exampleDir, 'src');
      const targetSrcDir = path.join(config.paths.app, 'src');

      if (fs.existsSync(sourceSrcDir)) {
        fs.cpSync(sourceSrcDir, targetSrcDir, { recursive: true, force: true });
      }
    },
  );
}

module.exports = copyExample;
