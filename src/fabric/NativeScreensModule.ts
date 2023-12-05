/* eslint-disable @typescript-eslint/ban-types */
// its needed for codegen to work
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  startTransition(reactTag: Int32 | null): Int32[];
  updateTransition(reactTag: Int32 | null, progress: Double): boolean;
  finishTransition(reactTag: Int32 | null, canceled: boolean): boolean;
}

// TODO: investigate why it throws with getEnforcing on Android
export default TurboModuleRegistry.get<Spec>('RNSModule');
