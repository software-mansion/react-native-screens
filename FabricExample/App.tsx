import App from '../apps';
import { featureFlags } from 'react-native-screens';

featureFlags.experiment.synchronousScreenUpdatesEnabled = false;
featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled = false;
featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled = false;
featureFlags.experiment.androidResetScreenShadowStateOnOrientationChangeEnabled =
  true;
featureFlags.experiment.iosPreventReattachmentOfDismissedScreens = true;
featureFlags.experiment.iosPreventReattachmentOfDismissedModals = true;
featureFlags.experiment.ios26AllowInteractionsDuringTransition = true;
featureFlags.stable.debugLogging = true;

export default App;
