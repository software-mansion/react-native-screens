import StackBuilder from './StackBuilder';
import Screens from './screens';


export default StackBuilder(Screens, {
  // headerShadowVisible: false,
  headerTintColor: 'black',
  headerBackTitleVisible: false,
  gestureEnabled: true,
  contentStyle: { backgroundColor: 'white' },

  // prop for @react-navigation/native-stack
  // fullScreenGestureEnabled: true,

  // prop for react-native-screens/native-stack
  fullScreenSwipeEnabled: true,
});
