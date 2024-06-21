import * as React from 'react';
import {
  Button,
  View,
} from 'react-native';

import { NavProp } from '../types';

export default function Home({ navigation }: NavProp): React.ReactNode {
  return (
    <View style={{ flex: 1, backgroundColor: 'cornflowerblue' }}>
      <Button
        title="Navigate Second"
        onPress={() => navigation.navigate('Second')}
      />
      <Button
        title="Navigate PushWithScrollView"
        onPress={() => navigation.navigate('PushWithScrollView')}
      />
      <Button
        title="Navigate SheetScreen"
        onPress={() => navigation.navigate('SheetScreen')}
      />
      <Button
        title="Push SheetScreen"
        onPress={() => navigation.push('SheetScreen')}
      />
    </View>
  );
}

