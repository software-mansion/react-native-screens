const { exit } = require("process");
const { exec } = require("child_process");

// ktlint task in android/build.gradle
const ktlintCommand = "./android/gradlew -p android ktlint -q -Pfile="

// takes file as parameter optionally supplied by lint-staged
const fileName = process.argv[2] ?? '';

// executes command with file parameter
exec(`${ktlintCommand}${fileName}`, (error, stdout) => {
  if (error) {
    console.log(stdout);
    return exit(1);
  }
});
