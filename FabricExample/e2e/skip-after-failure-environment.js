const { DetoxCircusEnvironment } = require('detox/runners/jest');

/**
 * Skips the rest of a spec file once one of its tests fails.
 *
 * Specs navigate once in `beforeAll` and build on earlier tests' state, so the
 * tests after a failure mostly fail too, and when the app hangs each of them
 * waits out the whole `testTimeout`. Skipping them before they start also
 * skips the `beforeAll` hooks of `describe` blocks left with no tests to run.
 * Tests already failed by a `beforeAll` keep their error.
 */
class SkipAfterFailureEnvironment extends DetoxCircusEnvironment {
  async handleTestEvent(event, state) {
    if (event.name === 'test_done' && event.test.errors.length > 0) {
      skipPendingTests(state.rootDescribeBlock);
    }
    await super.handleTestEvent(event, state);
  }
}

function skipPendingTests(describeBlock) {
  for (const child of describeBlock.children) {
    if (child.type === 'describeBlock') {
      skipPendingTests(child);
    } else if (child.startedAt === null && child.errors.length === 0) {
      child.mode = 'skip';
    }
  }
}

module.exports = SkipAfterFailureEnvironment;
