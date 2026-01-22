import * as React from 'react';

import {Button, Pressable, StyleSheet, Text, View} from 'react-native';
import {FullWindowOverlay} from 'react-native-screens';
import PressableWithFeedback from '../../shared/PressableWithFeedback';

function SharedPressable() {
  return (
    <PressableWithFeedback>
      <View style={{ width: '100%', height: 32 }}>
        <Text>Pressable</Text>
      </View>
    </PressableWithFeedback>
  );
}

function HomeScreen() {
  const [overlayShown, setOverlayShown] = React.useState(false);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} collapsable={true}>
      <Text>Home Screen</Text>
      <Button title="Show Overlay" onPress={() => setOverlayShown(true)} />
      <SharedPressable />
      {overlayShown && (
        <FullWindowOverlay>
          <View style={{flex: 1}}>
            <Pressable
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(130, 200, 120, 0.8)',
              }}
              onPress={() => setOverlayShown(false)}>
              <Text>Overlay</Text>
              <SharedPressable />
            </Pressable>
          </View>
        </FullWindowOverlay>
      )}
    </View>
  );
}

function Header() {
  return (
    <View pointerEvents='box-none' style={{ height: 100.6666 }}>
      <View style={[StyleSheet.absoluteFill, { }]}>
        <View style={{ flex: 1, backgroundColor: 'white', opacity: 0.6}} />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <View style={{flex: 1, backgroundColor: 'lightsalmon' }}>
      <Header />
      <HomeScreen />
    </View>
  );
}

