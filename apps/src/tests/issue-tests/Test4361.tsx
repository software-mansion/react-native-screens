import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { enableFreeze } from 'react-native-screens';
import { Colors } from '@apps/shared/styling';

enableFreeze(true);

const Stack = createNativeStackNavigator();
const Tab = createNativeBottomTabNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.screen}>
      <Text>Home (Tab A)</Text>
      <Text>
        1. Press "Push Calendar" below{'\n'}
        2. Press back{'\n'}
        3. Immediately tap another tab during the pop animation
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.getParent()?.navigate('Calendar')}>
          <Text style={styles.buttonText}>Push Calendar</Text>
        </Pressable>
    </View>
  );
}

function MyPetsScreen() {
  return (
    <View style={styles.screen}>
      <Text>My Pets (Tab B)</Text>
      <ScrollView style={styles.scrollArea}>
        {Array.from({ length: 30 }, (_, i) =>
          <Pressable
            key={i}
            style={styles.listItem}
            onPress={() => console.log(`pressed pet item ${i}`)}>
              <Text style={styles.listItemText}>Pet item {i}</Text>
            </Pressable>
        )}
      </ScrollView>
      <Text>
        If touches are broken, tapping items above will produce NO console logs.
      </Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text>Profile (Tab C)</Text>
      <Pressable
        style={styles.button}
        onPress={() => console.log('Profile button pressed')}>
          <Text style={styles.buttonText}>Press me</Text>
        </Pressable>
        <Text>
          If touches are broken, pressing the button above will produce NO console
          log.
        </Text>
    </View>
  );
}

function TabsNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
      name="MyPets"
      component={MyPetsScreen}
      options={{ title: 'My Pets' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function CalendarScreen({ navigation }: any) {
  return (
    <View style={styles.screen}>
      <Text>Calendar (pushed screen)</Text>
      <Text>
        Press the header back button, then IMMEDIATELY tap a different tab.
      </Text>
      <Pressable style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back (alternative)</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
        name="Tabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: 'Calendar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  button: {
    backgroundColor: Colors.BlueDark100,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  listItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.NavyDark120,
  },
  listItemText: {
    fontSize: 16,
  },
});
