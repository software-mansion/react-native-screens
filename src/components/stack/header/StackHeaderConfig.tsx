import React, { forwardRef } from 'react';
import { View } from 'react-native';
import type {
  StackHeaderConfigProps,
  StackHeaderConfigRef,
} from './StackHeaderConfig.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const StackHeaderConfig = forwardRef<
  StackHeaderConfigRef,
  StackHeaderConfigProps
>(function StackHeaderConfig() {
  return <View />;
});

export default StackHeaderConfig;
