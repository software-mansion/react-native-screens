import type { Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export default {
  startTransition(_tag: Int32 | null) {
    console.log('[RNScreens] startTransition is not supported on web.');
    return false;
  },
  updateTransition(_tag: Int32 | null, _progress: Double) {
    console.log('[RNScreens] startTransition is not supported on web.');
    return false;
  },
  finishTransition(_tag: Int32 | null, _canceled: boolean) {
    console.log('[RNScreens] startTransition is not supported on web.');
    return false;
  },
};
