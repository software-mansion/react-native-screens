import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
};

function HomeScreen({ navigation }: NativeStackScreenProps<ParamList, 'Home'>) {
  return (
    <View style={styles.home}>
      <Text style={styles.text}>
        In the sheet, scroll the list down a little, then drag it back down in
        one gesture, past its top, without lifting the finger.
      </Text>
      <Button title="Open sheet" onPress={() => navigation.navigate('Sheet')} />
    </View>
  );
}

function SheetScreen({
  navigation,
}: NativeStackScreenProps<ParamList, 'Sheet'>) {
  return (
    <ScrollView nestedScrollEnabled contentContainerStyle={styles.content}>
      <Text style={styles.title}>Top of the list</Text>
      <Button title="Close" onPress={() => navigation.goBack()} />
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <Text key={index} style={styles.row}>
          Row {index + 1}
        </Text>
      ))}
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator<ParamList>();

export default function TestFormSheetScrollToTop() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Sheet"
          component={SheetScreen}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [1],
            headerShown: false,
            contentStyle: styles.sheet,
          }}
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
