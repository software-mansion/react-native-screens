import App from '../apps';
import { featureFlags } from 'react-native-screens';

featureFlags.experiment.synchronousScreenUpdatesEnabled = false;
featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled = false;
featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled = false;
featureFlags.experiment.androidResetScreenShadowStateOnOrientationChangeEnabled =
  true;

export default App;
