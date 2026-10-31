import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button } from '@apps/shared';
import { Colors } from '@apps/shared/styling';

const ROW_COUNT = 40;

type ParamList = {
  Home: undefined;
  Sheet: undefined;
  ImmediateSheet: undefined;
};

type SheetParamList = {
  List: { delayed: boolean };
  Pushed: undefined;
};

function HomeScreen({ navigation }: NativeStackScreenProps<ParamList, 'Home'>) {
  return (
    <View style={styles.home}>
      <Text style={styles.text}>
        In the first sheet, the list mounts 1 s after the sheet is presented.
        Expand the sheet, scroll the list down, then back up: the list should
        scroll and the sheet should stay in place. With the list at its top, a
        drag down should move the sheet.{'\n\n'}
        In either sheet, push a screen on the stack nested in the sheet, and
        drag down from its header, and from its text: the sheet should move.
      </Text>
      <Button
        title="Open sheet (list mounted 1 s later)"
        onPress={() => navigation.navigate('Sheet')}
      />
      <Button
        title="Open sheet (list mounted right away)"
        onPress={() => navigation.navigate('ImmediateSheet')}
      />
    </View>
  );
}

function ListScreen({
  navigation,
  route,
}: NativeStackScreenProps<SheetParamList, 'List'>) {
  const { delayed } = route.params;
  const [ready, setReady] = useState(!delayed);
  useEffect(() => {
    if (!delayed) {
      return;
    }
    const timeout = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(timeout);
  }, [delayed]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
      <Text style={styles.title}>Top of the list</Text>
      <Button
        title="Push a screen"
        onPress={() => navigation.navigate('Pushed')}
      />
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <Text key={index} style={styles.row}>
          Row {index + 1}
        </Text>
      ))}
    </ScrollView>
  );
}

function PushedScreen() {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Pushed screen</Text>
      <Text style={styles.text}>
        Drag the sheet down from the header, or from this text.
      </Text>
    </View>
  );
}

const SheetStack = createNativeStackNavigator<SheetParamList>();

function SheetNavigator({ delayed }: { delayed: boolean }) {
  return (
    <SheetStack.Navigator screenOptions={{ contentStyle: styles.sheet }}>
      <SheetStack.Screen
        name="List"
        component={ListScreen}
        initialParams={{ delayed }}
      />
      <SheetStack.Screen name="Pushed" component={PushedScreen} />
    </SheetStack.Navigator>
  );
}

const DelayedSheet = () => <SheetNavigator delayed />;
const ImmediateSheet = () => <SheetNavigator delayed={false} />;

const sheetOptions = {
  presentation: 'formSheet',
  sheetAllowedDetents: [0.5, 1],
  headerShown: false,
  contentStyle: { backgroundColor: Colors.cardBackground },
} as const;

const Stack = createNativeStackNavigator<ParamList>();

export default function Test4994() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Sheet"
          component={DelayedSheet}
          options={sheetOptions}
        />
        <Stack.Screen
          name="ImmediateSheet"
          component={ImmediateSheet}
          options={sheetOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    padding: 16,
    gap: 12,
  },
  text: {
    fontSize: 15,
  },
  sheet: {
    backgroundColor: Colors.cardBackground,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
  row: {
    paddingVertical: 14,
  },
});
