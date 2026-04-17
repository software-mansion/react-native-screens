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
