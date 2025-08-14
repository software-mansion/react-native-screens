// NOTE: The full native feature set (style, image, menu, etc.) is available, but the TS types in src/types.tsx need to be updated to match. This example uses only the currently typed props (title, icon, onPress, enabled).
import React from 'react';
import { View, Alert, Button, Text, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const demoScreens = [
  { name: 'PlainButtonDemo', title: 'Plain Button' },
  { name: 'IconButtonDemo', title: 'Icon Button' },
  { name: 'MenuButtonDemo', title: 'Menu Button' },
  { name: 'BadgeButtonDemo', title: 'Badge Button' },
  { name: 'DisabledButtonDemo', title: 'Disabled Button' },
  { name: 'CustomColorButtonDemo', title: 'Custom Color Button' },
  { name: 'ProminentStyleButtonDemo', title: 'Prominent Style Button' },
  { name: 'TitleStyleButtonDemo', title: 'Title Style Button' },
  { name: 'IconSharesBgButtonDemo', title: 'Icon SharesBackground' },
  { name: 'TextButtonWithWidthDemo', title: 'Text Button With Width' },
  { name: 'IconButtonsWithSpacingDemo', title: 'Icon Buttons With Spacing' },
  { name: 'HeaderTintColorDemo', title: 'Header Tint Color' },
  { name: 'DoneStyleButtonDemo', title: 'Done Style Button' },
  { name: 'AdvancedMenuButtonDemo', title: 'Advanced Menu Button' },
];

const MainScreen = ({ navigation }: any) => (
  <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1 }}>
    <View style={{padding: 8}}>
      <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center'}}>iOS only</Text>
    </View>
    {demoScreens.map((screen) => (
      <Button
        key={screen.name}
        onPress={() => navigation.navigate(screen.name)}
        title={screen.title}
      />
    ))}
  </ScrollView>
);

const DemoScreenContent = () => (
  <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
    <View style={{ width: '100%', height: 200, backgroundColor: 'black' }} />
    <View style={{ width: '100%', height: 200, backgroundColor: 'grey' }} />
    <View style={{ width: '100%', height: 1000, backgroundColor: 'white' }} />
  </ScrollView>
);

const PlainButtonDemo = DemoScreenContent;
const IconButtonDemo = DemoScreenContent;
const MenuButtonDemo = DemoScreenContent;
const BadgeButtonDemo = DemoScreenContent;
const DisabledButtonDemo = DemoScreenContent;
const CustomColorButtonDemo = DemoScreenContent;
const ProminentStyleButtonDemo = DemoScreenContent;
const TitleStyleButtonDemo = DemoScreenContent;
const IconSharesBgButtonDemo = DemoScreenContent;
const TextButtonWithWidthDemo = DemoScreenContent;
const IconButtonsWithSpacingDemo = DemoScreenContent;
const HeaderTintColorDemo = DemoScreenContent;
const DoneStyleButtonDemo = DemoScreenContent;
const AdvancedMenuButtonDemo = DemoScreenContent;

export default function BarButtonItemsExample() {
  return (
    <Stack.Navigator screenOptions={{ headerTransparent: Platform.OS === 'ios' && parseInt(Platform.Version) >= 26 }}>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ title: 'BarButtonItems Demos' }}
      />
      <Stack.Screen
        name="PlainButtonDemo"
        component={PlainButtonDemo}
        options={{
          title: 'Plain Button',
          headerRightBarButtonItems: [
            {
              title: 'Info',
              onPress: () => Alert.alert('Info pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="IconButtonDemo"
        component={IconButtonDemo}
        options={{
          title: 'Icon Button',
          headerRightBarButtonItems: [
            {
              image: require('../../assets/search_black.png'),
              onPress: () => Alert.alert('Icon pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="MenuButtonDemo"
        component={MenuButtonDemo}
        options={{
          title: 'Menu Button',
          headerRightBarButtonItems: [
            {
              title: 'Menu',
              menu: {
                items: [
                  {
                    title: 'Option 1',
                    onPress: () => Alert.alert('Option 1 pressed'),
                  },
                  {
                    title: 'Option 2',
                    onPress: () => Alert.alert('Option 2 pressed'),
                  },
                ],
              },
            },
          ],
        }}
      />
      <Stack.Screen
        name="BadgeButtonDemo"
        component={BadgeButtonDemo}
        options={{
          title: 'Badge Button',
          headerRightBarButtonItems: [
            {
              title: 'Badge',
              badge: {
                value: '3',
                color: 'white',
                backgroundColor: 'red',
              },
              onPress: () => Alert.alert('Badge pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="DisabledButtonDemo"
        component={DisabledButtonDemo}
        options={{
          title: 'Disabled Button',
          headerRightBarButtonItems: [
            {
              title: 'Disabled',
              enabled: false,
              onPress: () => Alert.alert('Should not fire'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="CustomColorButtonDemo"
        component={CustomColorButtonDemo}
        options={{
          title: 'Custom Color Button',
          headerRightBarButtonItems: [
            {
              title: 'Purple',
              tintColor: 'purple',
              onPress: () => Alert.alert('Purple pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="ProminentStyleButtonDemo"
        component={ProminentStyleButtonDemo}
        options={{
          title: 'Prominent Style Button',
          headerRightBarButtonItems: [
            {
              title: 'Prominent',
              style: 'prominent',
              tintColor: 'green',
              onPress: () => Alert.alert('Prominent pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="TitleStyleButtonDemo"
        component={TitleStyleButtonDemo}
        options={{
          title: 'Title Style Button',
          headerRightBarButtonItems: [
            {
              title: 'Styled',
              titleStyle: {
                fontFamily: 'Georgia',
                fontSize: 18,
                fontWeight: 'bold',
                color: 'blue',
              },
              onPress: () => Alert.alert('Styled pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="IconSharesBgButtonDemo"
        component={IconSharesBgButtonDemo}
        options={{
          title: 'Icon SharesBackground',
          headerRightBarButtonItems: [
            {
              image: require('../../assets/search_black.png'),
              onPress: () => Alert.alert('Icon with sharesBackground pressed'),
            },
            {
              image: require('../../assets/search_black.png'),
              onPress: () => Alert.alert('Icon with sharesBackground pressed'),
            },
            {
              image: require('../../assets/search_black.png'),
              sharesBackground: false,
              onPress: () => Alert.alert('Icon with sharesBackground false pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="TextButtonWithWidthDemo"
        component={TextButtonWithWidthDemo}
        options={{
          title: 'Text Button With Width',
          headerRightBarButtonItems: [
            {
              title: 'Wide',
              width: 100,
              onPress: () => Alert.alert('Wide text button pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="IconButtonsWithSpacingDemo"
        component={IconButtonsWithSpacingDemo}
        options={{
          title: 'Icon Buttons With Spacing',
          headerRightBarButtonItems: [
            {
              image: require('../../assets/search_black.png'),
              onPress: () => Alert.alert('First icon pressed'),
            },
            {
              spacing: 100,
            },
            {
              image: require('../../assets/search_white.png'),
              onPress: () => Alert.alert('Second icon pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="HeaderTintColorDemo"
        component={HeaderTintColorDemo}
        options={{
          title: 'Header Tint Color',
          headerTintColor: 'red',
          headerRightBarButtonItems: [
            {
              title: 'Tinted',
              onPress: () => Alert.alert('Tinted pressed'),
            },
            {
              image: require('../../assets/search_black.png'),
              onPress: () => Alert.alert('Tinted icon pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="DoneStyleButtonDemo"
        component={DoneStyleButtonDemo}
        options={{
          title: 'Done Style Button',
          headerRightBarButtonItems: [
            {
              title: 'Done',
              style: 'done',
              onPress: () => Alert.alert('Done text pressed'),
            },
            {
              image: require('../../assets/search_black.png'),
              style: 'done',
              onPress: () => Alert.alert('Done icon pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="AdvancedMenuButtonDemo"
        component={AdvancedMenuButtonDemo}
        options={{
          title: 'Advanced Menu Button',
          headerRightBarButtonItems: [
            {
              title: 'Menu',
              menu: {
                title: 'Context menu',
                items: [
                  {
                    title: 'Action 1',
                    systemImage: 'star',
                    state: 'on',
                    attributes: 'destructive',
                    discoverabilityTitle: 'Favorite',
                    onPress: () => Alert.alert('Action 1 pressed'),
                  },
                  {
                    title: 'Action 2',
                    systemImage: 'square.and.arrow.up',
                    state: 'off',
                    attributes: 'disabled',
                    discoverabilityTitle: 'Disabled Action',
                    onPress: () => Alert.alert('Action 2 pressed'),
                  },
                  {
                    title: 'Submenu',
                    items: [
                      {
                        title: 'Sub Action 1',
                        state: 'mixed',
                        onPress: () => Alert.alert('Sub Action 1 pressed'),
                        attributes: 'keepsMenuPresented',
                        discoverabilityTitle: 'Sub Action 1',
                      },
                      {
                        title: 'Sub Action 2',
                        onPress: () => Alert.alert('Sub Action 2 pressed'),
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
  );
}
