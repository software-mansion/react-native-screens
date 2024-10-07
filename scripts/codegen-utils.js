const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const packageJSON = require('../package.json');

const TAG = `[RNScreens]>`;
const ROOT_DIR = path.resolve(__dirname, '..');
const ANDROID_DIR = path.resolve(ROOT_DIR, 'android');
const GENERATED_DIR = path.resolve(ANDROID_DIR, 'build/generated');
const OLD_ARCH_DIR = path.resolve(ANDROID_DIR, 'src/paper');
const SPECS_DIR = path.resolve(ROOT_DIR, packageJSON.codegenConfig.jsSrcsDir);
const PACKAGE_NAME = packageJSON.codegenConfig.android.javaPackageName;
const RN_DIR = path.resolve(ROOT_DIR, 'node_modules/react-native');
const RN_CODEGEN_DIR = path.resolve(
  ROOT_DIR,
  'node_modules/@react-native/codegen',
);

const SOURCE_FOLDER = 'java/com/facebook/react/viewmanagers';
const SCREENS_SOURCE_FOLDER = 'java/com/swmansion/rnscreens'

const SOURCE_FOLDERS = [
  {codegenPath: `${GENERATED_DIR}/source/codegen/${SOURCE_FOLDER}`, oldArchPath: `${OLD_ARCH_DIR}/${SOURCE_FOLDER}`},
  {codegenPath: `${GENERATED_DIR}/source/codegen/${SCREENS_SOURCE_FOLDER}`, oldArchPath: `${OLD_ARCH_DIR}/${SCREENS_SOURCE_FOLDER}`},
]

const BLACKLISTED_FILES = new Set([
  'FabricEnabledViewGroup.kt',
  'NativeProxy.kt',
  'FabricEnabledHeaderConfigViewGroup.kt',
]);


function exec(command) {
  console.log(`${TAG} exec: ${command}`);
  execSync(command);
}

function readdirSync(dir) {
  console.log(`${TAG} readdir: ${dir}`);
  return fs.readdirSync(dir).filter(file => {
    if (BLACKLISTED_FILES.has(file)) {
      console.log(`${TAG} Ignoring blacklisted file: ${file}`);
      return false;
    }
    return true;
  });
}

function throwIfFileMissing(filepath) {
  if (!fs.lstatSync(filepath, { throwIfNoEntry: false })?.isFile()) {
    throw new Error(`${TAG} File ${filepath} does not exist or is not a regular file. Maybe it is not codegen-managed and you forgot to put it in blacklist?`);
  }
}

function fixOldArchJavaForRN72Compat(dir) {
  console.log(`${TAG} fixOldArchJavaForRN72Compat:  ${dir}`);
  // see https://github.com/rnmapbox/maps/issues/3193
  const files = readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const fileExtension = path.extname(file);
    if (fileExtension === '.java') {
      let fileContent = fs.readFileSync(filePath, 'utf-8');
      let newFileContent = fileContent.replace(
        /extends ReactContextBaseJavaModule implements TurboModule/g,
        'extends ReactContextBaseJavaModule implements ReactModuleWithSpec, TurboModule',
      );
      if (fileContent !== newFileContent) {
        // also insert an import line with `import com.facebook.react.bridge.ReactModuleWithSpec;`
        newFileContent = newFileContent.replace(
          /import com.facebook.react.bridge.ReactMethod;/,
          'import com.facebook.react.bridge.ReactMethod;\nimport com.facebook.react.bridge.ReactModuleWithSpec;',
        );

        console.log(' => fixOldArchJava applied to:', filePath);
        fs.writeFileSync(filePath, newFileContent, 'utf-8');
      }
    } else if (fs.lstatSync(filePath).isDirectory()) {
      fixOldArchJavaForRN72Compat(filePath);
    }
  });
}

async function generateCodegen() {
  console.log(`${TAG} generateCodegen`);
  exec(`rm -rf ${GENERATED_DIR}`);
  exec(`mkdir -p ${GENERATED_DIR}/source/codegen/`);

  exec(
    `node ${RN_CODEGEN_DIR}/lib/cli/combine/combine-js-to-schema-cli.js --platform android ${GENERATED_DIR}/source/codegen/schema.json ${SPECS_DIR}`,
  );
  exec(
    `node ${RN_DIR}/scripts/generate-specs-cli.js --platform android --schemaPath ${GENERATED_DIR}/source/codegen/schema.json --outputDir ${GENERATED_DIR}/source/codegen --javaPackageName ${PACKAGE_NAME}`,
  );

  fixOldArchJavaForRN72Compat(`${GENERATED_DIR}/source/codegen/java/`);
}

async function generateCodegenJavaOldArch() {
  await generateCodegen();

  SOURCE_FOLDERS.forEach(({codegenPath, oldArchPath}) => {
    const generatedFiles = readdirSync(codegenPath);
    const oldArchFiles = readdirSync(oldArchPath);
    const existingFilesSet = new Set(oldArchFiles.map(fileName => fileName));

    generatedFiles.forEach(generatedFile => {
      if (!existingFilesSet.has(generatedFile)) {
        console.warn(
          `${TAG} ${generatedFile} not found in paper dir, if it's used on Android you need to copy it manually and implement yourself before using auto-copy feature.`,
        );
      }
    });

    if (oldArchFiles.length === 0) {
      console.warn(
        `${TAG} Paper destination with codegen interfaces is empty. This might be okay if you don't have any interfaces/delegates used on Android, otherwise please check if OLD_ARCH_DIR and SOURCE_FOLDERS are set properly.`,
      );
    }

    oldArchFiles.forEach(file => {
      if (!fs.existsSync(`${codegenPath}/${file}`)) {
        console.warn(
          `${TAG} ${file} file does not exist in codegen artifacts source destination. Please check if you still need this interface/delagete.`
        );
      } else {
        exec(`cp -rf ${codegenPath}/${file} ${oldArchPath}/${file}`);
      }
    });
  });
}

function compareFileAtTwoPaths(filename, firstPath, secondPath) {
  console.log(`${TAG} compare file: ${filename} at path first: ${firstPath}, second: ${secondPath}`);
  const filepathA = `${firstPath}/${filename}`;
  const filepathB = `${secondPath}/${filename}`;

  throwIfFileMissing(filepathA);
  throwIfFileMissing(filepathB);

  const fileA = fs.readFileSync(filepathA, 'utf-8');
  const fileB = fs.readFileSync(filepathB, 'utf-8');

  if (fileA !== fileB) {
    throw new Error(
      `${TAG} File ${filename} is different at ${firstPath} and ${secondPath}. Make sure you committed codegen autogenerated files.`,
    );
  }
}

async function checkCodegenIntegrity() {
  console.log(`${TAG} checkCodegenIntegrity`);

  await generateCodegen();

  SOURCE_FOLDERS.forEach(({codegenPath, oldArchPath}) => {
    const oldArchFiles = readdirSync(oldArchPath);
    oldArchFiles.forEach(file => {
      compareFileAtTwoPaths(file, codegenPath, oldArchPath);
    });
  });
}

module.exports = { generateCodegenJavaOldArch, checkCodegenIntegrity };

