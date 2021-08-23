/* 
 * This script is a wrapper for gradle & ktlint to make
 * it work properly with lint-staged.
 */

const { exit } = require("process");
const { exec } = require("child_process");

// ktlint task in android/build.gradle
const ktlintCommand = "./android/gradlew -p android ktlint -q -Pfile="

// takes file as parameter passed by lint-staged (optional)
const fileName = process.argv[2] !== undefined ? process.argv[2] : '';

// executes command with file parameter without space between them
exec(`${ktlintCommand}${fileName}`, (error, stdout) => {
  if (error) {
    console.log(error);
    console.log(stdout);
    return exit(1);
  }
});
