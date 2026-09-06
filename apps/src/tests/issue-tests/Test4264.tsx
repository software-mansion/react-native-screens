import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Colors } from '@apps/shared/styling';

const Stack = createNativeStackNavigator();

function HeaderLeft() {
  return (
    <View
      style={[
        styles.headerBox,
        { backgroundColor: Colors.BlueLight100, width: 70 },
      ]}>
      <Text style={styles.headerText}>Left</Text>
    </View>
  );
}

function HeaderRight() {
  return (
    <View
      style={[
        styles.headerBox,
        { backgroundColor: Colors.RedLight100, width: 70 },
      ]}>
      <Text style={styles.headerText}>Right</Text>
    </View>
  );
}

function HeaderTitle() {
  return (
    <View
      style={[
        styles.headerBox,
        { backgroundColor: Colors.YellowLight100, width: 120 },
      ]}>
      <Text style={styles.headerText}>Custom Title</Text>
    </View>
  );
}

function HomeScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [showHeaderLeft, setShowHeaderLeft] = useState(true);
  const [showHeaderRight, setShowHeaderRight] = useState(true);
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);

  useLayoutEffect(() => {
    // @ts-ignore: exactOptionalPropertyTypes isn't handled correctly in navigation options
    navigation.setOptions({
      headerLeft: showHeaderLeft ? () => <HeaderLeft /> : undefined,
      headerTitle: showHeaderTitle ? () => <HeaderTitle /> : undefined,
      headerRight: showHeaderRight ? () => <HeaderRight /> : undefined,
    });
  }, [navigation, showHeaderLeft, showHeaderRight, showHeaderTitle]);

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.instructions}>
        Steps to reproduce:{'\n'}
        1. Enable display cutout{'\n'}
        2. Tap the search icon to open the search bar{'\n'}
        3. Rotate the device portrait -&gt; landscape -&gt; portrait{'\n'}
        4. Before fix: header items reappear overlapping the search bar
      </Text>

      <View style={styles.toggleSection}>
        <Button
          title={`Toggle headerLeft (${showHeaderLeft ? 'ON' : 'OFF'})`}
          onPress={() => setShowHeaderLeft(prev => !prev)}
        />
        <Button
          title={`Toggle headerRight (${showHeaderRight ? 'ON' : 'OFF'})`}
          onPress={() => setShowHeaderRight(prev => !prev)}
        />
        <Button
          title={`Toggle headerTitle (${showHeaderTitle ? 'ON' : 'OFF'})`}
          onPress={() => setShowHeaderTitle(prev => !prev)}
        />
      </View>

      <View style={styles.stateDisplay}>
        <Text style={styles.stateText}>
          headerLeft: {showHeaderLeft ? 'visible' : 'hidden'}
        </Text>
        <Text style={styles.stateText}>
          headerRight: {showHeaderRight ? 'visible' : 'hidden'}
        </Text>
        <Text style={styles.stateText}>
          headerTitle: {showHeaderTitle ? 'custom' : 'default'}
        </Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Test4264',
            headerSearchBarOptions: {
              placeholder: 'Search...',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  headerText: {
    color: Colors.White,
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  toggleSection: {
    gap: 8,
  },
  stateDisplay: {
    marginTop: 24,
    padding: 12,
    backgroundColor: Colors.OffWhite,
    borderRadius: 8,
  },
  stateText: {
    fontSize: 13,
    color: Colors.NavyLight80,
    marginBottom: 4,
  },
});
