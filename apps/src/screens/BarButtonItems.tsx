// NOTE: The full native feature set (style, image, menu, etc.) is available, but the TS types in src/types.tsx need to be updated to match. This example uses only the currently typed props (title, icon, onPress, enabled).
import React from 'react';
import {
  View,
  Alert,
  Button,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const demoScreens = [
  { name: 'PlainButtonDemo', title: 'Plain Button' },
  { name: 'IconButtonDemo', title: 'Icon Button' },
  { name: 'XcassetsIconButtonDemo', title: 'Xcassets Icon Button' },
  { name: 'SystemIconButtonDemo', title: 'System Icon Button' },
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
  { name: 'ReactNodeButtonDemo', title: 'React Node Button' },
  { name: 'BackButtonVisibleDemo', title: 'Back Button Visible' },
  { name: 'IdentifierExample', title: 'Identifier Example' },
  { name: 'IdentifierExample2', title: 'Identifier Example 2' },
  { name: 'ExessiveItemsExample', title: 'Exessive Items Example' },
];

const MainScreen = ({ navigation }: any) => (
  <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1 }}>
    <View style={{ padding: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
        iOS only
      </Text>
    </View>
    {demoScreens.map(screen => (
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
const XcassetsIconButtonDemo = DemoScreenContent;
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
const ReactNodeButtonDemo = DemoScreenContent;
const BackButtonVisibleDemo = DemoScreenContent;
const IdentifierExample = DemoScreenContent;
const IdentifierExample2 = DemoScreenContent;
const ExessiveItemsExample = DemoScreenContent;

export default function BarButtonItemsExample() {
  return (
    // @ts-ignore
    <Stack.Navigator
      screenOptions={{
        headerTransparent:
          Platform.OS === 'ios' && parseInt(Platform.Version) >= 26,
      }}>
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Info',
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              icon: {
                type: 'image',
                source: require('../../assets/variableIcons/icon_fill.png'),
                tinted: false,
              },
              tintColor: 'red',
              label: 'Title',
              onPress: () => Alert.alert('Icon pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="XcassetsIconButtonDemo"
        component={XcassetsIconButtonDemo}
        options={{
          title: 'Icon Button',
          unstable_headerRightItems: () => [
            {
              type: 'button',
              icon: {
                type: 'xcassets',
                name: 'logo',
              },
              label: 'Xcassets',
              onPress: () => Alert.alert('Icon Xcassets pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="SystemIconButtonDemo"
        component={IconButtonDemo}
        options={{
          title: 'System image Button',
          unstable_headerRightItems: () => [
            {
              type: 'button',
              icon: {
                type: 'sfSymbol',
                name: 'square.and.arrow.up',
              },
              label: 'Title',
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
          unstable_headerRightItems: () => [
            {
              type: 'menu',
              label: 'Menu',
              menu: {
                items: [
                  {
                    label: 'Option 1',
                    type: 'action',
                    onPress: () => Alert.alert('Option 1 pressed'),
                  },
                  {
                    label: 'Option 2',
                    type: 'action',
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Badge',
              badge: {
                value: '3',
                style: {
                  color: 'white',
                  backgroundColor: 'red',
                },
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Disabled',
              disabled: true,
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Purple',
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Prominent',
              variant: 'prominent',
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Styled',
              labelStyle: {
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Title',
              icon: {
                type: 'image',
                source: require('../../assets/search_black.png'),
              },
              onPress: () => Alert.alert('Icon with sharesBackground pressed'),
              sharesBackground: true,
            },
            {
              type: 'button',
              label: 'Title',
              icon: {
                type: 'image',
                source: require('../../assets/search_black.png'),
              },
              onPress: () => Alert.alert('Icon with sharesBackground pressed'),
              sharesBackground: true,
            },
            {
              type: 'button',
              label: 'Title',
              icon: {
                type: 'image',
                source: require('../../assets/search_black.png'),
              },
              onPress: () => Alert.alert('Icon with sharesBackground pressed'),
              sharesBackground: false,
            },
            {
              type: 'button',
              label: 'Title',
              icon: {
                type: 'image',
                source: require('../../assets/search_black.png'),
              },
              hidesSharedBackground: true,
              onPress: () =>
                Alert.alert('Icon with sharesBackground false pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="TextButtonWithWidthDemo"
        component={TextButtonWithWidthDemo}
        options={{
          title: 'Text Button With Width',
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Wide',
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Title',
              icon: {
                type: 'image',
                source: require('../../assets/search_black.png'),
              },
              onPress: () => Alert.alert('First icon pressed'),
            },
            {
              type: 'spacing',
              spacing: 100,
            },
            {
              type: 'button',
              label: 'Title',
              icon: {
                type: 'image',
                source: require('../../assets/search_white.png'),
              },
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Tinted',
              onPress: () => Alert.alert('Tinted pressed'),
            },
            {
              type: 'button',
              label: 'Title',
              icon: {
                type: 'image',
                source: require('../../assets/search_black.png'),
              },
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
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Done',
              variant: 'done',
              onPress: () => Alert.alert('Done text pressed'),
            },
            {
              type: 'button',
              label: 'DoneIcon',
              icon: {
                type: 'image',
                source: require('../../assets/search_black.png'),
              },
              variant: 'done',
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
          unstable_headerRightItems: () => [
            {
              type: 'menu',
              label: 'Menu',
              menu: {
                label: 'Context menu',
                items: [
                  {
                    label: 'Action 1',
                    icon: { type: 'xcasset', name: 'logo' },
                    type: 'action',
                    state: 'on',
                    destructive: true,
                    discoverabilityLabel: 'Favorite',
                    onPress: () => Alert.alert('Action 1 pressed'),
                  },
                  {
                    label: 'Action 2',
                    icon: { type: 'sfSymbol', name: 'square.and.arrow.up' },
                    type: 'action',
                    state: 'off',
                    disabled: true,
                    discoverabilityLabel: 'Disabled Action',
                    onPress: () => Alert.alert('Action 2 pressed'),
                  },
                  {
                    label: 'Submenu',
                    displayInline: true,
                    destructive: true,
                    icon: { type: 'sfSymbol', name: 'star' },
                    type: 'submenu',
                    items: [
                      {
                        label: 'Sub Action 1',
                        state: 'mixed',
                        type: 'action',
                        subtitle: 'With subtitle',
                        onPress: () => Alert.alert('Sub Action 1 pressed'),
                        destructive: true,
                        keepsMenuPresented: true,
                        discoverabilityLabel: 'Sub Action 1',
                        icon: { type: 'xcassets', name: 'logo' },
                      },
                      {
                        label: 'Sub Action 2',
                        type: 'action',
                        onPress: () => Alert.alert('Sub Action 2 pressed'),
                      },
                    ],
                  },
                  {
                    label: 'Palette',
                    displayInline: true,
                    displayAsPalette: true,
                    destructive: true,
                    type: 'submenu',
                    items: [
                      {
                        state: 'on',
                        icon: { type: 'sfSymbol', name: '0.circle.fill' },
                        type: 'action',
                        onPress: () => Alert.alert('Sub Action 1 pressed'),
                      },
                      {
                        icon: { type: 'sfSymbol', name: '1.circle.fill' },
                        type: 'action',
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
      <Stack.Screen
        name="ReactNodeButtonDemo"
        component={ReactNodeButtonDemo}
        options={{
          title: 'React Node Button',
          headerBackVisible: true,
          unstable_headerRightItems: () => [
            {
              type: 'custom',
              element: (
                <TouchableOpacity
                  onPress={() => Alert.alert('React Node 1 pressed')}>
                  <Text style={{ color: 'blue' }}>React Node 1</Text>
                </TouchableOpacity>
              ),
              hidesSharedBackground: true,
            },
            {
              type: 'button',
              label: 'Native',
              onPress: () => Alert.alert('Native button pressed'),
              sharesBackground: true,
            },
            {
              type: 'custom',
              element: (
                <TouchableOpacity
                  onPress={() => Alert.alert('React Node 2 pressed')}>
                  <Text style={{ color: 'red' }}>React Node 2</Text>
                </TouchableOpacity>
              ),
            },
          ],
        }}
      />
      <Stack.Screen
        name="BackButtonVisibleDemo"
        component={BackButtonVisibleDemo}
        options={{
          title: 'Back Button Visible',
          headerBackVisible: true,
          unstable_headerLeftItems: () => [
            {
              type: 'custom',
              element: (
                <TouchableOpacity
                  onPress={() => Alert.alert('Left React Node')}>
                  <Text style={{ color: 'blue' }}>React Node</Text>
                </TouchableOpacity>
              ),
            },
            {
              type: 'button',
              label: 'Native',
              onPress: () => Alert.alert('Native button pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="IdentifierExample"
        component={IdentifierExample}
        options={({ navigation }) => ({
          title: 'Identifier Example',
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Button',
              onPress: () => {
                navigation.navigate('IdentifierExample2');
              },
              style: 'prominent',
            },
          ],
        })}
      />
      <Stack.Screen
        name="IdentifierExample2"
        component={IdentifierExample2}
        options={{
          title: 'Identifier Example 2',
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Btn',
              onPress: () => Alert.alert('Button 1 pressed'),
            },
          ],
        }}
      />
      <Stack.Screen
        name="ExessiveItemsExample"
        component={ExessiveItemsExample}
        options={{
          title: 'Exessive Items Example',
          unstable_headerRightItems: () => [
            {
              type: 'button',
              label: 'Button 1',
              onPress: () => Alert.alert('Button 1 pressed'),
            },
            {
              type: 'button',
              label: 'Button 2',
              onPress: () => Alert.alert('Button 2 pressed'),
            },
            {
              type: 'button',
              label: 'Button 3',
              onPress: () => Alert.alert('Button 3 pressed'),
            },
            {
              type: 'button',
              label: 'Button 4',
              onPress: () => Alert.alert('Button 4 pressed'),
            },
          ],
        }}
      />
    </Stack.Navigator>
  );
}
