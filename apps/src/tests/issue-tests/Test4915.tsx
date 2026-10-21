// Requires a 72x72 px PNG (a 24 pt icon at scale 3) copied into the app sandbox before opening the
// screen (iOS simulator; repeat after every reinstall, which wipes the sandbox):
// cp icon.png "$(xcrun simctl get_app_container <udid> org.reactjs.native.example.FabricExample data)/Documents/rns-4915-icon.png"
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// A local file outside of the app bundle (like icons rendered by
// `@react-native-vector-icons/get-image` or assets downloaded by expo-updates).
const LOCAL_FILE_ICON = { uri: '~/Documents/rns-4915-icon.png', scale: 3 };
const REMOTE_ICON = { uri: 'https://reactnative.dev/img/tiny_logo.png' };

type RouteParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<RouteParamList>();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Copy a PNG to Documents/rns-4915-icon.png in the app container (see the
        comment at the top of Test4915.tsx), then open the menu.
      </Text>
      <Text style={styles.text}>
        The "Local file" and "Remote" header buttons, the "Local file
        (template)" action and the "Local file submenu" all have an icon.
      </Text>
    </View>
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
            title: 'Test4915',
            unstable_headerRightItems: () => [
              {
                type: 'button',
                label: 'Local file',
                icon: { type: 'image', source: LOCAL_FILE_ICON, tinted: false },
                onPress: () => Alert.alert('Local file pressed'),
              },
              {
                type: 'button',
                label: 'Remote',
                icon: { type: 'image', source: REMOTE_ICON, tinted: false },
                onPress: () => Alert.alert('Remote pressed'),
              },
              {
                type: 'menu',
                label: 'Menu',
                icon: { type: 'sfSymbol', name: 'ellipsis' },
                menu: {
                  items: [
                    {
                      type: 'action',
                      label: 'Local file (template)',
                      icon: { type: 'image', source: LOCAL_FILE_ICON },
                      onPress: () => Alert.alert('Local file (template)'),
                    },
                    {
                      type: 'action',
                      label: 'SF Symbol',
                      icon: { type: 'sfSymbol', name: 'pencil' },
                      onPress: () => Alert.alert('SF Symbol'),
                    },
                    {
                      type: 'submenu',
                      label: 'Local file submenu',
                      icon: {
                        type: 'image',
                        source: LOCAL_FILE_ICON,
                        tinted: false,
                      },
                      items: [
                        {
                          type: 'action',
                          label: 'Sub action',
                          onPress: () => Alert.alert('Sub action'),
                        },
                      ],
                    },
                  ],
                },
              },
            ],
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
    gap: 12,
  },
  text: {
    fontSize: 15,
  },
});
