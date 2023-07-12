import React from 'react';
import { ScreenProps } from 'react-native-screens';
import Animated from 'react-native-reanimated';
declare const ReanimatedNativeStackScreen: React.ForwardRefExoticComponent<Omit<ScreenProps, "ref"> & React.RefAttributes<React.ComponentClass<Animated.AnimateProps<{}>, any>>>;
export default ReanimatedNativeStackScreen;
