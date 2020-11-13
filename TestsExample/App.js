import React from 'react';
import {enableScreens} from 'react-native-screens';

import TestUserInteraction from './TestUserInteraction';

enableScreens();

export default () => {
  return <TestUserInteraction />;
};
