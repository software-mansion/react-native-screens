import React, { useRef, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type Routes = { Home: undefined; Covered: undefined; Landscape: undefined };
const Stack = createNativeStackNavigator<Routes>();

// Based on the three-screen reproduction in #4336. Keep the orientation-reset feature flag enabled.
// A motionless automated tap can pass even when real finger taps (with MOVE events) fail.
function Home({ navigation }: NativeStackScreenProps<Routes, 'Home'>) {
  const target = useRef<React.ElementRef<typeof View>>(null);
  const initialY = useRef<number | null>(null);
  const [presses, setPresses] = useState(0);
  const [measurement, setMeasurement] = useState('');
  const [inside, setInside] = useState<boolean | null>(null);
  const [restored, setRestored] = useState<boolean | null>(null);
  return (
    <View style={styles.content}>
      <Text>
        Press the counter, push both screens, return here, and press again with
        slight finger movement. Repeat the round trip. The counter must keep
        increasing; measured Y must remain near the touch Y.
      </Text>
      <Pressable
        ref={target}
        testID="orientation-counter"
        style={styles.target}
        onTouchStart={event => {
          const touchY = event.nativeEvent.pageY;
          target.current?.measure((_x, _y, _width, height, _pageX, pageY) => {
            initialY.current ??= pageY;
            setRestored(Math.abs(pageY - initialY.current) < 1);
            setInside(touchY >= pageY && touchY <= pageY + height);
            setMeasurement(
              `Measured Y: ${Math.round(pageY)}–${Math.round(pageY + height)}; touch Y: ${Math.round(touchY)}`,
            );
          });
        }}
        onPress={() => setPresses(value => value + 1)}>
        <Text testID="orientation-count">Presses: {presses}</Text>
      </Pressable>
      <View style={styles.readout}>
        <Text testID="orientation-measurement">{measurement}</Text>
        <Text testID="orientation-inside">
          Touch inside measured bounds: {String(inside)}
        </Text>
        <Text testID="orientation-restored">
          Layout restored: {String(restored)}
        </Text>
      </View>
      <Button
        testID="push-covered"
        title="Push covered screen"
        onPress={() => navigation.push('Covered')}
      />
    </View>
  );
}

function Covered({ navigation }: NativeStackScreenProps<Routes, 'Covered'>) {
  return (
    <View style={styles.content}>
      <Button
        testID="push-landscape"
        title="Push landscape screen"
        onPress={() => navigation.push('Landscape')}
      />
      <Button
        testID="return-home"
        title="Return home"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

function Landscape({
  navigation,
}: NativeStackScreenProps<Routes, 'Landscape'>) {
  return (
    <View style={styles.content}>
      <Text>Landscape: the Home screen is detached during this rotation.</Text>
      <Button
        testID="return-portrait"
        title="Return to portrait"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default function Test4551() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ orientation: 'portrait' }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Covered" component={Covered} />
        <Stack.Screen
          name="Landscape"
          component={Landscape}
          options={{
            orientation: 'landscape',
            presentation: 'fullScreenModal',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  target: { padding: 24, backgroundColor: '#dbeafe', borderRadius: 8 },
  readout: { height: 100 },
});
