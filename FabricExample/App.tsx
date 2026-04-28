import App from '../apps';
import { featureFlags } from 'react-native-screens';

featureFlags.experiment.synchronousScreenUpdatesEnabled = false;
featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled = true;
featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled = true;
featureFlags.experiment.androidResetScreenShadowStateOnOrientationChangeEnabled =
  true;
featureFlags.experiment.iosPreventReattachmentOfDismissedScreens = true;
featureFlags.experiment.iosPreventReattachmentOfDismissedModals = true;
featureFlags.experiment.ios26AllowInteractionsDuringTransition = true;
featureFlags.stable.debugLogging = true;

export default App;
