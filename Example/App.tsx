import App from '../apps';

import { featureFlags } from 'react-native-screens';

featureFlags.experiment.iosPreventReattachmentOfDismissedScreens = true;
featureFlags.experiment.ios26AllowInteractionsDuringTransition = true;

export default App;
