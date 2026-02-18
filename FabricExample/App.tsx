import App from '../apps';
import { featureFlags } from 'react-native-screens';

featureFlags.experiment.synchronousScreenUpdatesEnabled = false;
featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled = false;
featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled = false;
featureFlags.experiment.androidResetScreenShadowStateOnOrientationChangeEnabled =
  true;
// TODO: @t0maboro - remove ts-ignore after release
// @ts-ignore - will be present since react-native-screens 4.21.0
featureFlags.experiment.iosPreventReattachmentOfDismissedScreens = false;

export default App;
