import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

type StackParamList = {
  First: undefined;
  Second: undefined;
};

const ROWS = 60;

function Rows({ tint }: { tint: string }) {
  return (
    <View style={styles.rows}>
      {Array.from({ length: ROWS }, (_, row) => (
        <View key={row} style={[styles.row, { backgroundColor: tint }]}>
          <View style={styles.icon} />
          <View style={styles.texts}>
            <Text style={styles.title}>Row {row + 1}</Text>
            <Text style={styles.subtitle}>Secondary line of text</Text>
          </View>
          <Text style={styles.amount}>{(row * 7.31).toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'First'>;
}) {
  return (
    <View style={styles.screen}>
      <Pressable
        testID="removed-screen-draw-push"
        style={styles.button}
        onPress={() => navigation.push('Second')}>
        <Text style={styles.buttonText}>PUSH</Text>
      </Pressable>
      <Rows tint="#e8eefc" />
    </View>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'Second'>;
}) {
  return (
    <View style={styles.screen}>
      <Pressable
        testID="removed-screen-draw-pop"
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>POP</Text>
      </Pressable>
      <Rows tint="#fcefe8" />
    </View>
  );
}

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'white' },
  button: {
    margin: 8,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#2f6fed',
  },
  buttonText: { color: 'white', fontWeight: '600' },
  rows: { padding: 8, gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    gap: 8,
  },
  icon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#9aa4b8' },
  texts: { flex: 1 },
  title: { fontSize: 13, fontWeight: '600' },
  subtitle: { fontSize: 11, color: '#666' },
  amount: { fontSize: 13 },
});
