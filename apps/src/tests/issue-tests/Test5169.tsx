/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5169
// Upstream: https://github.com/react-navigation/react-navigation/issues/13067
//
// Description:
// On iOS (especially iOS 16+ / 26+), rendering a custom component in headerTitle
// (or ScreenStackHeaderCenterView) with `flex: 1` or `width: '100%'` causes the title view
// to ignore boundaries and extend across the navigation bar, overlapping headerRight.
//
// Root Cause in react-native-screens (RNSScreenStackHeaderSubview.mm):
// 1. `needsAutoLayout` is only enabled for Left and Right subviews, whereas Center/Title
//    subviews have `needsAutoLayout = NO`.
// 2. Auto Layout is bypassed for `navitem.titleView`, so `RNSScreenStackHeaderSubview`
//    retains `translatesAutoresizingMaskIntoConstraints = YES` and sets its bounds directly
//    from Yoga layout metrics (which evaluates flex: 1 or width: '100%' to screen width).
// 3. UIKit centers this unconstrained frame without horizontal compression resistance,
//    causing it to collide with and render underneath headerRight.

type StackParamList = {
  Home: undefined;
  PushedWithBackButton: undefined;
  Width100Percent: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function CustomHeaderTitle({
  title = 'headerTitle (flex: 1)',
  styleType = 'flex',
}: {
  title?: string;
  styleType?: 'flex' | 'width100' | 'auto';
}) {
  const containerStyle =
    styleType === 'flex'
      ? styles.headerTitleFlex
      : styleType === 'width100'
      ? styles.headerTitleWidth100
      : styles.headerTitleAuto;

  return (
    <View style={[styles.headerTitleBase, containerStyle]}>
      <Text style={styles.headerTitleText} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

function CustomHeaderRight({
  label = 'Action Button',
  onPress,
}: {
  label?: string;
  onPress?: () => void;
}) {
  const [pressCount, setPressCount] = useState(0);

  return (
    <Pressable
      testID="header-right-button"
      onPress={() => {
        setPressCount(c => c + 1);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.headerRightButton,
        pressed && styles.headerRightButtonPressed,
      ]}>
      <Text style={styles.headerRightText}>
        {label} ({pressCount})
      </Text>
    </Pressable>
  );
}

function HomeScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'Home'>;
}) {
  const [mode, setMode] = useState<'flex' | 'width100' | 'auto'>('flex');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <CustomHeaderTitle title={`Title (${mode})`} styleType={mode} />
      ),
      headerRight: () => <CustomHeaderRight label="RightBtn" />,
    });
  }, [navigation, mode]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Issue #5169 Reproduction</Text>
        <Text style={styles.bannerSubtitle}>
          Custom headerTitle with flex: 1 / width: '100%' ignores boundaries and
          overlaps headerRight on iOS.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Bug Observation:</Text>
        <Text style={styles.bodyText}>Look at the navigation bar above:</Text>
        <Text style={styles.bulletText}>
          {'\u2022'} The cyan/blue box is the{' '}
          <Text style={styles.codeText}>headerTitle</Text>.
        </Text>
        <Text style={styles.bulletText}>
          {'\u2022'} The orange box is the{' '}
          <Text style={styles.codeText}>headerRight</Text> button.
        </Text>
        <Text style={[styles.bodyText, styles.warningText]}>
          When mode is "flex: 1" or "width: 100%", the cyan title view extends
          all the way across and renders directly underneath / overlapping the
          orange RightBtn!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Switch Title Mode:</Text>
        <View style={styles.buttonRow}>
          <Button
            title="flex: 1 (Buggy)"
            color={mode === 'flex' ? '#007AFF' : '#666'}
            onPress={() => setMode('flex')}
          />
          <Button
            title="width: '100%' (Buggy)"
            color={mode === 'width100' ? '#007AFF' : '#666'}
            onPress={() => setMode('width100')}
          />
          <Button
            title="auto (Constrained)"
            color={mode === 'auto' ? '#007AFF' : '#666'}
            onPress={() => setMode('auto')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Test Navigation Scenarios:</Text>
        <Button
          title="Push Screen With Back Button"
          onPress={() => navigation.navigate('PushedWithBackButton')}
        />
        <View style={{ height: 8 }} />
        <Button
          title="Open Screen With width: '100%'"
          onPress={() => navigation.navigate('Width100Percent')}
        />
      </View>
    </ScrollView>
  );
}

function PushedScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'PushedWithBackButton'>;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>
          Back Button + flex: 1 Title + headerRight
        </Text>
        <Text style={styles.bannerSubtitle}>
          With the back button on the left, the custom title with flex: 1 still
          spans and overflows into the headerRight element on iOS.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bodyText}>
          Observe that the cyan title box collides with the orange headerRight
          button on the right edge.
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

function Width100Screen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'Width100Percent'>;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>width: '100%' Header Title</Text>
        <Text style={styles.bannerSubtitle}>
          The title component explicitly specifies width: '100%', causing Yoga
          to give it the full screen width.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bodyText}>
          UIKit places this unconstrained width centered in the navigation bar,
          overlapping headerRight.
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
}

export default function Test5169() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => (
              <CustomHeaderTitle
                title="headerTitle (flex: 1)"
                styleType="flex"
              />
            ),
            headerRight: () => <CustomHeaderRight label="RightBtn" />,
          }}
        />
        <Stack.Screen
          name="PushedWithBackButton"
          component={PushedScreen}
          options={{
            headerTitle: () => (
              <CustomHeaderTitle title="Pushed (flex: 1)" styleType="flex" />
            ),
            headerRight: () => <CustomHeaderRight label="RightBtn" />,
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="Width100Percent"
          component={Width100Screen}
          options={{
            headerTitle: () => (
              <CustomHeaderTitle
                title="Title (width: '100%')"
                styleType="width100"
              />
            ),
            headerRight: () => <CustomHeaderRight label="RightBtn" />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  headerTitleBase: {
    height: 36,
    backgroundColor: 'rgba(0, 220, 255, 0.35)',
    borderColor: '#0055ff',
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitleFlex: {
    flex: 1,
  },
  headerTitleWidth100: {
    width: '100%',
  },
  headerTitleAuto: {
    alignSelf: 'center',
  },
  headerTitleText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#002288',
  },
  headerRightButton: {
    backgroundColor: '#ff7700',
    borderColor: '#b34700',
    borderWidth: 1.5,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightButtonPressed: {
    backgroundColor: '#cc5500',
  },
  headerRightText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  banner: {
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  bodyText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 13,
    color: '#444',
    marginLeft: 8,
  },
  codeText: {
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  warningText: {
    color: '#b32400',
    fontWeight: '600',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'column',
    gap: 6,
  },
});
