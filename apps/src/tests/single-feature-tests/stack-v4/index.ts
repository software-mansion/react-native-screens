import { Scenario } from '../../shared/helpers';
import Orientation from './Orientation';

const StackScreenScenarios: Scenario[] = [
  {
    name: 'orientation',
    key: 'orientation',
    AppComponent: Orientation,
    platforms: ['ios', 'android'],
  },
];

export default StackScreenScenarios;
