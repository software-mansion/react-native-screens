import App from '../apps';
import { featureFlags } from '../src';

featureFlags.experiment.synchronousScreenUpdatesEnabled = false
featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled = false
featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled = false

export default App;
