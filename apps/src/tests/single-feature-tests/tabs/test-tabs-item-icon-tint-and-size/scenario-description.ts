import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Icon Tint and Size',
  key: 'test-tabs-item-icon-tint-and-size',
  details:
    'Exercises custom tab bar item icons: iOS `renderingMode` on imageSource' +
    ' and sfSymbol icons, Android `tinting` on imageSource and' +
    ' drawableResource icons, per slot; Android per-tab' +
    ' `iconSize` with the active indicator size; iOS custom SF Symbols from' +
    ' the asset catalog.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
