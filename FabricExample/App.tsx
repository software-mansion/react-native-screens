import App from '../apps';
import { LogBox } from 'react-native';
import { featureFlags } from 'react-native-screens';

featureFlags.experiment.synchronousScreenUpdatesEnabled = true;
featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled = true;
featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled = true;
featureFlags.experiment.androidResetScreenShadowStateOnOrientationChangeEnabled =
  true;
featureFlags.stable.debugLogging = true;

// Hide all LogBox notifications (incl. the "Open debugger to view warnings"
// banner), which cover the bottom of the screen, e.g. the native tab bar, and
// break e2e taps in Debug builds. Logs still reach the debugger console;
// uncaught errors still open the full-screen LogBox.
LogBox.ignoreAllLogs();

export default App;
