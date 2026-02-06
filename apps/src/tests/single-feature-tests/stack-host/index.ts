import { Scenario } from '../../shared/helpers';
import PreventNativeDismissSingleStack from './prevent-native-dismiss-single-stack';
import PreventNativeDismissNestedStack from './prevent-native-dismiss-nested-stack';

const StackHostScenarios: Scenario[] = [
  PreventNativeDismissSingleStack,
  PreventNativeDismissNestedStack,
];

export default StackHostScenarios;
