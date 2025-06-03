import Colors from '../../shared/styling/Colors';
import React from 'react';
import { View } from 'react-native';
import { ScreenStackHost, StackScreen } from 'react-native-screens';

export default function App() {
  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      <ScreenStackHost>
        <StackScreen>
          <View style={{ flex: 1, backgroundColor: Colors.YellowDark40 }} />
        </StackScreen>
      </ScreenStackHost>
    </View>
  );
}
