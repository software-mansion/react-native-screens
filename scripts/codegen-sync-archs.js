const { generateCodegenJavaOldArch } = require('./codegen-utils');

if (require.main === module) {
  async function main() {
    await generateCodegenJavaOldArch();
  }
  main();
}
