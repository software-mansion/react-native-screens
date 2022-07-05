import StackBuilder from './StackBuilder';
import Modals from './modals';


export default StackBuilder(Modals, {
  headerShown: false,
  animation: 'fade_from_bottom',
  presentation: 'containedTransparentModal',
});
