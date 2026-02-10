import React from 'react';
import { View } from 'react-native';

import { BottomTabBarHeightContext } from './BottomTabBarHeightContext';

function TabsHost(props: React.ComponentProps<typeof View>) {
  return (
    <BottomTabBarHeightContext.Provider value={0}>
      <View {...props} />
    </BottomTabBarHeightContext.Provider>
  );
}

export default TabsHost;
