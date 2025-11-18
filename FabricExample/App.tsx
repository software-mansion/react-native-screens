import App from '../apps';
import { featureFlags } from '../src';

featureFlags.experiment.synchronousScreenUpdatesEnabled = false
featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled = false
featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled = false
featureFlags.experiment.earlyScreenOrientationChangeEnabled = true

export default App;
