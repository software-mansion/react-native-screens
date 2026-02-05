/**
 * Models single test scenario.
 */
export interface Scenario {
  /**
   * Human readable name of the scenario. White spaces allowed.
   */
  name: string;
  /**
   * Globally unique key identifying this scenario.
   * Must be in kebab-case.
   * Should match the filename of the scenario file.
   */
  key: string;
  /**
   * Additional description of what this test covers.
   */
  details?: string;
  /**
   * What platforms does this test cover.
   */
  platforms?: ('android' | 'ios')[];
  /**
   * Component that will render the test scenario. It should be standalone!
   * That means it should be possible to render this w/o any additional harness
   * as top-level application component & it should remain functional.
   */
  AppComponent: React.ComponentType;
}

export type KeyList = Record<keyof any, undefined>;

const UC_REGEX = /[A-Z][^A-Z]+/g;

/**
 * Splits a string into words based on uppercase letters
 */
export function splitOnUpperCase(str: string) {
  if (str.length === 0) {
    return '';
  }

  const matches = [...str.matchAll(UC_REGEX)];

  return matches.map(m => m.at(0) ?? '').join(' ');
}
