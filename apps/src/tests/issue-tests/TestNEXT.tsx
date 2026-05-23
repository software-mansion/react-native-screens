import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, ScrollView, Text, View } from 'react-native';
import { Colors } from '@apps/shared/styling';

type StackParamList = {
  Home: undefined;
  FormSheet: undefined;
  Purple: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

type StackNavigationProp = NativeStackNavigationProp<StackParamList>;

const SCROLL_ROW_COUNT = 40;

function FullHeightScrollView({
  title,
  backgroundColor,
}: {
  title: string;
  backgroundColor: string;
}) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 32,
        paddingTop: 100,
      }}>
      <Text style={{ fontSize: 18, fontWeight: '600', padding: 16 }}>
        {title}
      </Text>
      {[...Array(SCROLL_ROW_COUNT).keys()].map(index => (
        <Text key={index} style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          Scroll row {index}
        </Text>
      ))}
    </ScrollView>
  );
}

function Home({ navigation }: { navigation: StackNavigationProp }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
      }}>
      <Text style={{ marginBottom: 16 }}>Regular stack screen</Text>
      <Button
        title="Open FormSheet"
        onPress={() => navigation.navigate('FormSheet')}
        testID="home-open-form-sheet"
      />
    </View>
  );
}

function FormSheetScreen({ navigation }: { navigation: StackNavigationProp }) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.GreenLight100 }}>
      <FullHeightScrollView
        title="FormSheet (ScrollView)"
        backgroundColor={Colors.GreenLight100}
      />
      <View style={{ padding: 16, gap: 8 }}>
        <Button
          title="Open Purple"
          onPress={() => {
            navigation.goBack();
            navigation.navigate('Purple');
          }}
          testID="form-sheet-open-purple"
        />
      </View>
    </View>
  );
}

function PurpleScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.PurpleLight100 }}>
      <FullHeightScrollView
        title="Purple (ScrollView)"
        backgroundColor={Colors.PurpleLight100}
      />
    </View>
  );
}

export default function TestNEXT() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="FormSheet"
          component={FormSheetScreen}
          options={{
            headerShown: false,
            presentation: 'formSheet',
            sheetAllowedDetents: [0.5],
          }}
        />
        <Stack.Screen
          name="Purple"
          component={PurpleScreen}
          options={{
            title: 'Purple',
            headerShown: true,
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
