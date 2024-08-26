import * as React from 'react';

import { sheetInitialOptions } from './state';

import Home from './screens/Home';
import Second from './screens/Second';
import Third from './screens/Third';
import SheetScreen from './screens/SheetScreen';
import SheetScreenWithScrollView from './screens/SheetScreenWithScrollView';
import ModalScreen from './screens/ModalScreen';
import PushWithScrollView from './screens/PushWithScrollView';
import SheetScreenWithTextInput from './screens/SheetScreenWithTextInput';
import { NativeStackNavigationOptions } from 'react-native-screens/native-stack';
import { NativeSyntheticEvent } from 'react-native';

export type RouteDescriptor = {
  name: string,
  component: (props: any) => React.JSX.Element,
  options?: NativeStackNavigationOptions,
};

const routes: Record<string, RouteDescriptor> = {
  First: {
    name: "First",
    component: Home,
  },
  Second: {
    name: "Second",
    component: Second,
    options: {
      fullScreenSwipeEnabled: true,
    },
  },
  Third: {
    name: "Third",
    component: Third,
    options: {
      headerShown: true,
      fullScreenSwipeEnabled: true,
    },
  },
  Sheet: {
    name: "SheetScreen",
    component: SheetScreen,
    options: {
      headerShown: false,
      stackPresentation: 'formSheet',
      sheetElevation: 24,
      unstable_screenStyle: {
        backgroundColor: 'firebrick',
      },
      ...sheetInitialOptions,
    },
  },
  Modal: {
    name: "ModalScreen",
    component: ModalScreen,
    options: {
      headerShown: false,
      stackPresentation: 'modal',
      ...sheetInitialOptions,
    },
  },
  SheetWithScrollView: {
    name: "SheetWithScrollView",
    component: SheetScreenWithScrollView,
    options: {
      headerShown: false,
      stackPresentation: 'formSheet',
      ...sheetInitialOptions,
    },
  },
  SheetWithTextInput: {
    name: "SheetWithTextInput",
    component: SheetScreenWithTextInput,
    options: {
      headerShown: false,
      stackPresentation: 'formSheet',
      ...sheetInitialOptions,
    },
  },
  PushWithScrollView: {
    name: "PushWithScrollView",
    component: PushWithScrollView,
  },
};

export default routes;

