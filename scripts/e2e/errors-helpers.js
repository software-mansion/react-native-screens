/**
 * @param {unknown} potentialError
 * @returns {potentialError is Error}
 */
function isError (potentialError) {
    return potentialError instanceof Error;
}

/**
 * @param {unknown} potentialError
 * @returns {asserts potentialError is Error}
 */
function assertError (potentialError) {
    if (!isError(potentialError)) {
      throw new Error(
        `${JSON.stringify(potentialError)} thrown, but it's an error or it comes from a different runtime environment!`
      );
    }
}


module.exports = {
    assertError,
}
