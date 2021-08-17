const { exit } = require("process");
const { exec } = require("child_process");

// ktlintFormat task in android/build.gradle
const ktlintFormatCommand = "./android/gradlew -p android ktlintFormat -q -Pfile="

// takes file as parameter optionally supplied by lint-staged
const fileName = process.argv[2] ?? '';

// executes command with file parameter
exec(`${ktlintFormatCommand}${fileName}`, (error, stdout) => {
  if (error) {
    console.log(stdout);
    return exit(0);
  }
});
