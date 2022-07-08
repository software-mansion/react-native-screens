import StackBuilder from './StackBuilder';
import Modals from './modals';


export default StackBuilder(Modals, {
  headerShown: false,

  // props for @react-navigation/native-stack
  // animation: 'fade_from_bottom',
  // presentation: 'containedTransparentModal',

  // props for react-native-screens/native-stack
  stackAnimation: 'fade_from_bottom',
  stackPresentation: 'containedTransparentModal',
});
