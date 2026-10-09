import React from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type StackParamList = {
  Home: undefined;
  Details: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function HeaderButton({ label, testID }: { label: string; testID: string }) {
  return (
    <Pressable style={styles.headerButton} testID={testID}>
      <Text style={styles.headerButtonText}>{label}</Text>
    </Pressable>
  );
}

const renderHeaderLeft = () => (
  <HeaderButton label="L" testID="test4360-header-left" />
);

const renderHeaderRight = () => (
  <HeaderButton label="R" testID="test4360-header-right" />
);

function Home({ navigation }: NativeStackScreenProps<StackParamList, 'Home'>) {
  return (
    <View style={styles.screen} testID="test4360-home">
      <Text style={styles.description}>
        1. Push Details{'\n'}
        2. Go back (back button or swipe){'\n'}
        3. Watch the header items on Details during the pop animation — they
        must keep their size (iOS 26+)
      </Text>
      <Button
        title="Push Details"
        testID="test4360-push-details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function Details({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Details'>) {
  return (
    <View style={styles.screen} testID="test4360-details">
      <Text style={styles.description}>
        This screen has custom headerLeft and headerRight views.
      </Text>
      <Button
        title="Go back"
        testID="test4360-go-back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default function Test4360() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{
            title: 'Details',
            headerLeft: renderHeaderLeft,
            headerRight: renderHeaderRight,
          }}
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
    gap: 16,
    backgroundColor: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e53935',
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
