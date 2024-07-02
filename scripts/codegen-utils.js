const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const packageJSON = require('../package.json');

function exec(command) {
  console.log('=> ' + command);
  execSync(command);
}

const ROOT_DIR = path.resolve(__dirname, '..');
const EXAMPLE_DIR = path.resolve(ROOT_DIR, 'example');
const ANDROID_DIR = path.resolve(ROOT_DIR, 'android');
const GENERATED_DIR = path.resolve(ANDROID_DIR, 'build/generated');
const OLD_ARCH_DIR = path.resolve(ANDROID_DIR, 'src/paper');
const SPECS_DIR = path.resolve(ROOT_DIR, packageJSON.codegenConfig.jsSrcsDir);
const PACKAGE_NAME = packageJSON.codegenConfig.android.javaPackageName;
const RN_DIR = path.resolve(EXAMPLE_DIR, 'node_modules/react-native');
const RN_CODEGEN_DIR = path.resolve(
  EXAMPLE_DIR,
  'node_modules/@react-native/codegen',
);

const SOURCE_FOLDERS = 'java/com/facebook/react/viewmanagers'
const CODEGEN_FILES_DIR = `${GENERATED_DIR}/source/codegen/${SOURCE_FOLDERS}`
const OLD_ARCH_FILES_DIR = `${OLD_ARCH_DIR}/${SOURCE_FOLDERS}`

function fixOldArchJavaForRN72Compat(dir) {
   // see https://github.com/rnmapbox/maps/issues/3193
   const files = fs.readdirSync(dir);
   files.forEach((file) => {
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

   const generatedFiles = fs.readdirSync(CODEGEN_FILES_DIR)
   const oldArchFiles = fs.readdirSync(OLD_ARCH_FILES_DIR)

   const existingFilesMap = Object.fromEntries(oldArchFiles.map(fileName => [fileName, 1]))


   generatedFiles.forEach(generatedFile => {
      if (!existingFilesMap[generatedFile]) {
         console.warn(`[RNScreens] ${generatedFile} not found in paper dir, if it's used on Android you need to copy it manually and implement yourself before using auto-copy feature.`)
      }
   })

   if (oldArchFiles.length === 0) {
      console.warn("[RNScreens] Paper destination with codegen interfaces is empty. This might be okay if you don't have any interfaces/delegates used on Android, otherwise please check if OLD_ARCH_DIR and SOURCE_FOLDERS are set properly.")
   }

   oldArchFiles.forEach(oldArchFile => {
      if (!fs.existsSync(`${CODEGEN_FILES_DIR}/${oldArchFile}`)) {
         console.warn(`[RNScreens] ${existingFile.name} file does not exist in codegen artifacts source destination. Please check if you still need this interface/delagete.`)
      }
   })



  oldArchFiles.forEach(file => {
      exec(`cp -rf ${CODEGEN_FILES_DIR}/${file} ${OLD_ARCH_FILES_DIR}/${file}`);
  })
}

function compareFileAtTwoPaths(filename, firstPath, secondPath) {
   const fileA = fs.readFileSync(`${firstPath}/${filename}`, 'utf-8');
   const fileB = fs.readFileSync(`${secondPath}/${filename}`, 'utf-8');

   if (fileA !== fileB) {
      throw new Error(`[RNScreens] File ${filename} is different at ${firstPath} and ${secondPath}. Make sure you commited codegen autogenerated files.`);
   }
}

async function checkCodegenIntegrity() {
   await generateCodegen();

   const oldArchFiles = fs.readdirSync(OLD_ARCH_FILES_DIR)
   oldArchFiles.forEach(file => {
      compareFileAtTwoPaths(file, CODEGEN_FILES_DIR, OLD_ARCH_FILES_DIR);
   })
}

if (require.main === module) {
  async function main() {
    await generateCodegenJavaOldArch();
  }
  main();
}

module.exports = { generateCodegenJavaOldArch, checkCodegenIntegrity };