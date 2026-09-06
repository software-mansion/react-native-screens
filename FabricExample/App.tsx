import App from '../apps';
import { featureFlags } from 'react-native-screens';

featureFlags.experiment.synchronousScreenUpdatesEnabled = true;
featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled = true;
featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled = true;
featureFlags.experiment.androidResetScreenShadowStateOnOrientationChangeEnabled =
  true;
featureFlags.stable.debugLogging = true;

export default App;
