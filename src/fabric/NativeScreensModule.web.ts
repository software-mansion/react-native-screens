import type { Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export default {
  startTransition(_tag: Int32 | null) {
    console.log(
      '[ReactNativeScreens] startTransition is not supported on web]'
    );
    return false;
  },
  updateTransition(_tag: Int32 | null, _progress: Double) {
    console.log(
      '[ReactNativeScreens] updateTransition is not supported on web]'
    );
    return false;
  },
  finishTransition(_tag: Int32 | null, _canceled: boolean) {
    console.log(
      '[ReactNativeScreens] finishTransition is not supported on web]'
    );
    return false;
  },
};
