export type ScenarioDevice =
  | 'iphone'
  | 'ipad'
  | 'iphone-duo'
  | 'android-phone'
  | 'android-tablet';

export interface ScenarioOsVersions {
  createdOn: string[];
  testOn: string[];
}

/**
 * Models single test scenario.
 */
export interface ScenarioDescription {
  /**
   * Human readable name of the scenario. White spaces allowed.
   */
  name: string;
  /**
   * Globally unique key identifying this scenario.
   * Must be in kebab-case.
   * Should match the filename of the scenario file.
   * This is also used as the testID for the scenario.
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
   * Devices this scenario must be executed on. Only list a device when the
   * scenario.md describes how to run the test on it (shared steps or a
   * dedicated `## Steps - <device>` section). Used to group release test runs
   * per device.
   * - 'iphone': iPhone (compact width).
   * - 'ipad': iPad (regular width, sidebar, resizable windows).
   * - 'iphone-duo': iPhone Duo (foldable; postures and fold transitions).
   * - 'android-phone': Android phone.
   * - 'android-tablet': Android tablet or foldable.
   */
  devices?: ScenarioDevice[];
  /**
   * OS versions per device. Keys must be listed in `devices`.
   * - `createdOn`: versions the scenario was written on and confirmed to work.
   * - `testOn`: versions a tester must run the scenario on.
   * Example: `{ iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 18.6', 'iOS 26.5'] } }`.
   */
  osVersions?: Partial<Record<ScenarioDevice, ScenarioOsVersions>>;
  /**
   * Setup a device needs before the scenario is run (orientation, window size,
   * size class, iPhone Duo posture set). Keys must be listed in `devices`.
   */
  deviceSetup?: Partial<Record<ScenarioDevice, string>>;
  /**
   * Indicates the current status of end-to-end (E2E) test coverage for this scenario.
   * - 'full': The scenario is completely covered by E2E tests.
   * - 'incomplete': The scenario is only partially covered or not covered at all.
   * Familiarize yourself with the scenario and manually complete the relevant parts.
   * - 'tbd': The E2E coverage is yet to be determined or implemented.
   */
  e2eCoverage: 'full' | 'incomplete' | 'tbd';
  /**
   * What the E2E test covers and why the rest is not automated. Expected when
   * `e2eCoverage` is 'incomplete' or 'tbd'.
   */
  e2eCoverageDetails?: string;
  /**
   * Whether this scenario should be included in the smoke test suite.
   */
  smokeTest: boolean;
}

/**
 * Component that will render the test scenario. It should be standalone!
 * That means it should be possible to render this w/o any additional harness
 * as top-level application component & it should remain functional.
 *
 * Scenario metadata is attached as a static `scenarioDescription` property.
 */
export type Scenario = React.ComponentType & {
  scenarioDescription: ScenarioDescription;
};

export interface ScenarioGroup<K extends string> {
  /**
   * Name of this scenario group
   */
  name: string;
  /**
   * Additional description of what this group of scenarios is related to.
   */
  details?: string;
  scenarios: Record<K, Scenario>;
}

export type KeyList = Record<keyof any, undefined>;

export function createScenario(
  Component: React.ComponentType,
  description: ScenarioDescription,
): Scenario {
  return Object.assign(Component, { scenarioDescription: description });
}
