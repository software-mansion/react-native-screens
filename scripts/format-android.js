/* 
 * This script is a wrapper for gradle & ktlintFormat to make
 * it work properly with lint-staged.
 */

const { exit } = require("process");
const { exec } = require("child_process");

// ktlintFormat task in android/build.gradle
const ktlintFormatCommand = "./android/gradlew -p android ktlintFormat -q -Pfile="

// takes file as parameter passed by lint-staged (optional)
const fileName = process.argv[2] !== undefined ? process.argv[2] : '';

// executes command with file parameter without space between them
exec(`${ktlintFormatCommand}${fileName}`, (error, stdout) => {
  if (error) {
    console.log(error);
    console.log(stdout);
    return exit(1);
  }
});
