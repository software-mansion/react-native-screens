/* eslint-disable @typescript-eslint/ban-types */
// its needed for codegen to work
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  startTransition(tag: Int32 | null): boolean;
  updateTransition(tag: Int32 | null, progress: Double): boolean;
  finishTransition(tag: Int32 | null, canceled: boolean): boolean;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNSModule');