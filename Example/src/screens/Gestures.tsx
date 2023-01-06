import React, { useState, useLayoutEffect } from 'react';

import {
  View,
  StyleSheet,
  I18nManager,
  Text,
  Platform,
  Dimensions,
} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  useHeaderHeight,
} from 'react-native-screens/native-stack';
import RNRestart from 'react-native-restart';
import { Button, SettingsSwitch } from '../shared';
import { SettingsMultiInput } from '../shared/SettingsMultiInput';

type StackParamList = {
  Main: undefined;
  Details: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'lavenderblush' }}>
    {Platform.OS === 'ios' ? (
      <Button
        title="Go to detail"
        onPress={() => navigation.navigate('Details')}
      />
    ) : (
      <Text style={styles.text}>
        Gesture features are only supported on iOS
      </Text>
    )}
    <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
  </View>
);

interface DetailsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Details'>;
}

const DetailsScreen = ({ navigation }: DetailsScreenProps): JSX.Element => {
  const headerHeight = useHeaderHeight();
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [fullScreenSwipeEnabled, setFullScreenSwipeEnabled] = useState(true);

  const { height, width } = Dimensions.get('window');

  // stored as strings for easier input handling
  const [start, setStart] = useState('40');
  const [end, setEnd] = useState((width - 40).toString());
  const [top, setTop] = useState('600');
  const [bottom, setBottom] = useState(height.toString());

  const startValue = parseInt(start) || 0;
  const endValue = parseInt(end) || width;
  const topValue = parseInt(top) || 0;
  const bottomValue = parseInt(bottom) || height;

  useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled,
      fullScreenSwipeEnabled,
      gestureResponseDistance: {
        start: startValue,
        end: endValue,
        top: topValue,
        bottom: bottomValue,
      },
    });
  }, [
    navigation,
    gestureEnabled,
    fullScreenSwipeEnabled,
    startValue,
    endValue,
    topValue,
    bottomValue,
  ]);

  return (
    <View style={{ ...styles.container, backgroundColor: 'lavender' }}>
      <SettingsSwitch
        label="Right to left"
        value={I18nManager.isRTL}
        onValueChange={() => {
          I18nManager.forceRTL(!I18nManager.isRTL);
          RNRestart.Restart();
        }}
      />
      <SettingsSwitch
        label="Gesture enabled"
        value={gestureEnabled}
        onValueChange={setGestureEnabled}
      />
      <View style={styles.wrapper}>
        {!gestureEnabled ? (
          <Text style={styles.text}>
            Disabling gestures on this screen will result in gestures being
            picked up by the stack which is higher in the hierarchy
          </Text>
        ) : (
          <Text style={styles.text}>
            Go back using swipe to dismiss gesture from the
            {I18nManager.isRTL ? ' right' : ' left'} edge
          </Text>
        )}
      </View>
      <SettingsSwitch
        label="Full screen swipe enabled"
        value={fullScreenSwipeEnabled}
        onValueChange={setFullScreenSwipeEnabled}
      />
      <SettingsMultiInput
        label="Gesture response distance"
        handlers={[
          {
            label: 'start',
            value: start,
            onValueChange: setStart,
          },
          {
            label: 'end',
            value: end,
            onValueChange: setEnd,
          },
          {
            label: 'top',
            value: top,
            onValueChange: setTop,
          },
          {
            label: 'bottom',
            value: bottom,
            onValueChange: setBottom,
          },
        ]}
      />
      {fullScreenSwipeEnabled && (
        <View
          style={{
            ...styles.gestureSurface,
            // full screen swipe & gesture response distance have no idea of existence of the header
            top: topValue - headerHeight,
            left: startValue,
            width: endValue - startValue,
            height: bottomValue - topValue,
          }}
        >
          <Text style={styles.heading}>Swipe here!</Text>
          <Text>
            This view presents where you can currently swipe while using the
            gesture response distance feature.
          </Text>
        </View>
      )}
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerHideBackButton: true,
      direction: I18nManager.isRTL ? 'rtl' : 'ltr',
    }}
  >
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{ title: 'Gestures' }}
    />
    <Stack.Screen
      name="Details"
      component={DetailsScreen}
      options={{ title: 'Gestures' }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  heading: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  wrapper: {
    height: 85,
  },
  text: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  gestureSurface: {
    opacity: 0.7,
    position: 'absolute',
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
