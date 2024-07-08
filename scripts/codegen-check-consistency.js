const { checkCodegenIntegrity } = require('./codegen-utils');

if (require.main === module) {
  async function main() {
    await checkCodegenIntegrity();
  }
  main();
}
