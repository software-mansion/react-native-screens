import StackBuilder from './StackBuilder';
import Screens from './screens';


export default StackBuilder(Screens, {
  headerShadowVisible: false,
  headerTintColor: 'black',
  headerBackTitleVisible: false,
  fullScreenGestureEnabled: true,
  contentStyle: { backgroundColor: 'white' },
});
