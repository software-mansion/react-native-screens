import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

type StackParamList = {
  Home: undefined;
  Video: undefined;
  Fullscreen: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

type Row = {
  id: number;
  label: string;
};

const rows: Row[] = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  label: `Row ${i + 1}`,
}));

function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Home'>) {
  const [totalTaps, setTotalTaps] = useState(0);
  const [rowTaps, setRowTaps] = useState<Record<number, number>>({});
  const [lastTap, setLastTap] = useState<string>('None');

  const onRowPress = (row: Row) => {
    setTotalTaps(v => v + 1);
    setRowTaps(v => ({ ...v, [row.id]: (v[row.id] ?? 0) + 1 }));
    setLastTap(row.label);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.instructions}>
          Steps to reproduce:{'\n'}1. Tap rows below to verify taps work{'\n'}2.
          Press "Go to Video Screen"{'\n'}3. Press "Enter Fullscreen" — forces
          landscape{'\n'}4. Press "Exit Fullscreen" — back to portrait{'\n'}5.
          Press "Go Back" — returns here{'\n'}6. Try tapping rows — Pressables
          may fail
        </Text>
        <Text style={styles.counter}>Total taps: {totalTaps}</Text>
        <Text style={styles.counter}>Last tap: {lastTap}</Text>
        <View style={styles.navButton}>
          <Button
            title="Go to Video Screen"
            onPress={() => navigation.navigate('Video')}
          />
        </View>
      </View>
      <FlatList
        data={rows}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => onRowPress(item)}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowCount}>
              Taps: {rowTaps[item.id] ?? 0}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

function VideoScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Video'>) {
  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Video Screen</Text>
      <Text style={styles.subtitle}>
        This simulates a video player screen.
      </Text>
      <View style={styles.buttonGap}>
        <Button
          title="Enter Fullscreen (landscape)"
          onPress={() => navigation.navigate('Fullscreen')}
        />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

function FullscreenScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Fullscreen'>) {
  return (
    <View style={styles.fullscreen}>
      <Text style={styles.fullscreenTitle}>Fullscreen Landscape Mode</Text>
      <Text style={styles.fullscreenSubtitle}>
        Simulates a fullscreen video player overlay
      </Text>
      <Button
        title="Exit Fullscreen"
        color="#ffffff"
        onPress={() => navigation.goBack()}
      />
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
          options={{ title: 'TestFullscreenPressables', orientation: 'portrait' }}
        />
        <Stack.Screen
          name="Video"
          component={VideoScreen}
          options={{ title: 'Video', orientation: 'portrait' }}
        />
        <Stack.Screen
          name="Fullscreen"
          component={FullscreenScreen}
          options={{
            presentation: 'fullScreenModal',
            orientation: 'landscape',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    gap: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  instructions: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4b5563',
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  navButton: {
    marginTop: 8,
  },
  listContent: {
    padding: 12,
    gap: 8,
  },
  row: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  rowCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#4b5563',
    textAlign: 'center',
  },
  buttonGap: {
    gap: 12,
    marginTop: 16,
  },
  fullscreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#111827',
  },
  fullscreenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  fullscreenSubtitle: {
    fontSize: 15,
    color: '#9ca3af',
  },
});
