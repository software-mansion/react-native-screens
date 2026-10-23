import App from '../apps';
import { LogBox } from 'react-native';
import { featureFlags } from 'react-native-screens';

featureFlags.stable.debugLogging = true;

// Hide all LogBox notifications (incl. the "Open debugger to view warnings"
// banner), which cover the bottom of the screen. Logs still reach the debugger
// console; uncaught errors still open the full-screen LogBox.
LogBox.ignoreAllLogs();

export default App;
