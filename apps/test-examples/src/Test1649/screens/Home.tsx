import * as React from 'react';
import {
  Button,
  View,
} from 'react-native';

import { NavProp } from '../types';

export default function Home({ navigation }: NavProp) {
  return (
    <View style={{ flex: 1, backgroundColor: 'cornflowerblue' }}>
      <Button
        title="Tap me for the second screen"
        onPress={() => navigation.navigate('Second')}
      />
      <Button
        title="Tap me for the PushWithScrollView"
        onPress={() => navigation.navigate('PushWithScrollView')}
      />
      <Button
        title="Tap me for the sheet"
        onPress={() => navigation.navigate('SheetScreen')}
      />
    </View>
  );
}

