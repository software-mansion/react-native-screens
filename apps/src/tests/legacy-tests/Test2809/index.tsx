import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createStackWithOptions } from './Shared';

// Naming convention:
// Enabled/Disabled - based on headerBackButtonMenu value
// Default/Generic/Minimal - based on headerBackButtonDisplayMode value
// DefaultText/CustomText/StyledText - based on label content

// headerBackButtonMenu: enabled
// headerBackButtonDisplayMode: default
const EnabledDefaultDefaultText = createStackWithOptions({}, {});
const EnabledDefaultCustomText = createStackWithOptions({}, { headerBackTitle: 'Custom' });
const EnabledDefaultStyledText = createStackWithOptions({}, { headerBackTitleStyle: {fontSize: 30} });
// headerBackButtonDisplayMode: generic
const EnabledGenericDefaultText = createStackWithOptions({}, { headerBackButtonDisplayMode: 'generic' });
const EnabledGenericCustomText = createStackWithOptions({}, { headerBackButtonDisplayMode: 'generic', headerBackTitle: 'Custom' });
const EnabledGenericStyledText = createStackWithOptions({}, { headerBackButtonDisplayMode: 'generic', headerBackTitleStyle: {fontSize: 30} });
// headerBackButtonDisplayMode: generic
const EnabledMinimalDefaultText = createStackWithOptions({}, { headerBackButtonDisplayMode: 'minimal' });
const EnabledMinimalCustomText = createStackWithOptions({}, { headerBackButtonDisplayMode: 'minimal', headerBackTitle: 'Custom' });
const EnabledMinimalStyledText = createStackWithOptions({}, { headerBackButtonDisplayMode: 'minimal', headerBackTitleStyle: {fontSize: 30} });

// headerBackButtonMenu: disabled
// headerBackButtonDisplayMode: default
const DisabledDefaultDefaultText = createStackWithOptions({}, { headerBackButtonMenuEnabled: false });
const DisabledDefaultCustomText = createStackWithOptions({}, { headerBackButtonMenuEnabled: false, headerBackTitle: 'Custom' });
const DisabledDefaultStyledText = createStackWithOptions({}, { headerBackButtonMenuEnabled: false, headerBackTitleStyle: {fontSize: 30}});
// headerBackButtonDisplayMode: generic
const DisabledGenericDefaultText = createStackWithOptions({}, { headerBackButtonMenuEnabled: false, headerBackButtonDisplayMode: 'generic' });
const DisabledGenericCustomText = createStackWithOptions({}, { headerBackButtonMenuEnabled: false, headerBackButtonDisplayMode: 'generic', headerBackTitle: 'Custom' });
const DisabledGenericStyledText = createStackWithOptions({}, { headerBackButtonMenuEnabled: false, headerBackButtonDisplayMode: 'generic', headerBackTitleStyle: {fontSize: 30} });
// headerBackButtonDisplayMode: generic
const DisabledMinimalDefaultText = createStackWithOptions({}, { headerBackButtonMenuEnabled: false, headerBackButtonDisplayMode: 'minimal' });
const DisabledMinimalCustomText = createStackWithOptions({}, { headerBackButtonMenuEnabled: false, headerBackButtonDisplayMode: 'minimal', headerBackTitle: 'Custom' });
const DisabledMinimalStyledText = createStackWithOptions({}, { headerBackButtonMenuEnabled: false, headerBackButtonDisplayMode: 'minimal', headerBackTitleStyle: {fontSize: 30} });

// Custom
const CustomLongDefaultText = createStackWithOptions({ headerTitle: 'LongLongLongLongLong'}, {});
const CustomDefaultTextWithLongTitle = createStackWithOptions({}, {headerTitle: 'LongLongLongLongLongLongLong'});
const CustomLongCustomText = createStackWithOptions({}, { headerBackTitle: 'LongLongLongLongLong' });
const CustomCustomTextWithLongTitle = createStackWithOptions({}, {headerBackTitle: 'CustomBack', headerTitle: 'LongLongLongLongLongLongLong'});

const Button = ({title, onPress}: {title: string, onPress: () => void}) => (
  <TouchableOpacity onPress={onPress} style={{alignItems:'center', padding: 3}}>
    <Text style={{fontSize: 16}}>{title}</Text>
  </TouchableOpacity>
);

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: 'yellow', justifyContent: 'center' }}>
      <Button
        title="EnabledDefaultDefaultText"
        onPress={() => navigation.navigate('EnabledDefaultDefaultText')}
      />
      <Button
        title="EnabledDefaultCustomText"
        onPress={() => navigation.navigate('EnabledDefaultCustomText')}
      />
      <Button
        title="EnabledDefaultStyledText"
        onPress={() => navigation.navigate('EnabledDefaultStyledText')}
      />

      <Button
        title="EnabledGenericDefaultText"
        onPress={() => navigation.navigate('EnabledGenericDefaultText')}
      />
      <Button
        title="EnabledGenericCustomText"
        onPress={() => navigation.navigate('EnabledGenericCustomText')}
      />
      <Button
        title="EnabledGenericStyledText"
        onPress={() => navigation.navigate('EnabledGenericStyledText')}
      />

      <Button
        title="EnabledMinimalDefaultText"
        onPress={() => navigation.navigate('EnabledMinimalDefaultText')}
      />
      <Button
        title="EnabledMinimalCustomText"
        onPress={() => navigation.navigate('EnabledMinimalCustomText')}
      />
      <Button
        title="EnabledMinimalStyledText"
        onPress={() => navigation.navigate('EnabledMinimalStyledText')}
      />

      <Button
        title="DisabledDefaultDefaultText"
        onPress={() => navigation.navigate('DisabledDefaultDefaultText')}
      />
      <Button
        title="DisabledDefaultCustomText"
        onPress={() => navigation.navigate('DisabledDefaultCustomText')}
      />
      <Button
        title="DisabledDefaultStyledText"
        onPress={() => navigation.navigate('DisabledDefaultStyledText')}
      />

      <Button
        title="DisabledGenericDefaultText"
        onPress={() => navigation.navigate('DisabledGenericDefaultText')}
      />
      <Button
        title="DisabledGenericCustomText"
        onPress={() => navigation.navigate('DisabledGenericCustomText')}
      />
      <Button
        title="DisabledGenericStyledText"
        onPress={() => navigation.navigate('DisabledGenericStyledText')}
      />

      <Button
        title="DisabledMinimalDefaultText"
        onPress={() => navigation.navigate('DisabledMinimalDefaultText')}
      />
      <Button
        title="DisabledMinimalCustomText"
        onPress={() => navigation.navigate('DisabledMinimalCustomText')}
      />
      <Button
        title="DisabledMinimalStyledText"
        onPress={() => navigation.navigate('DisabledMinimalStyledText')}
      />

      <Button
        title="CustomLongDefaultText"
        onPress={() => navigation.navigate('CustomLongDefaultText')}
      />
      <Button
        title="CustomDefaultTextWithLongTitle"
        onPress={() => navigation.navigate('CustomDefaultTextWithLongTitle')}
      />
      <Button
        title="CustomLongCustomText"
        onPress={() => navigation.navigate('CustomLongCustomText')}
      />
      <Button
        title="CustomCustomTextWithLongTitle"
        onPress={() => navigation.navigate('CustomCustomTextWithLongTitle')}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />

        <Stack.Screen name="EnabledDefaultDefaultText" component={EnabledDefaultDefaultText} />
        <Stack.Screen name="EnabledDefaultCustomText" component={EnabledDefaultCustomText} />
        <Stack.Screen name="EnabledDefaultStyledText" component={EnabledDefaultStyledText} />

        <Stack.Screen name="EnabledGenericDefaultText" component={EnabledGenericDefaultText} />
        <Stack.Screen name="EnabledGenericCustomText" component={EnabledGenericCustomText} />
        <Stack.Screen name="EnabledGenericStyledText" component={EnabledGenericStyledText} />

        <Stack.Screen name="EnabledMinimalDefaultText" component={EnabledMinimalDefaultText} />
        <Stack.Screen name="EnabledMinimalCustomText" component={EnabledMinimalCustomText} />
        <Stack.Screen name="EnabledMinimalStyledText" component={EnabledMinimalStyledText} />

        <Stack.Screen name="DisabledDefaultDefaultText" component={DisabledDefaultDefaultText} />
        <Stack.Screen name="DisabledDefaultCustomText" component={DisabledDefaultCustomText} />
        <Stack.Screen name="DisabledDefaultStyledText" component={DisabledDefaultStyledText} />

        <Stack.Screen name="DisabledGenericDefaultText" component={DisabledGenericDefaultText} />
        <Stack.Screen name="DisabledGenericCustomText" component={DisabledGenericCustomText} />
        <Stack.Screen name="DisabledGenericStyledText" component={DisabledGenericStyledText} />

        <Stack.Screen name="DisabledMinimalDefaultText" component={DisabledMinimalDefaultText} />
        <Stack.Screen name="DisabledMinimalCustomText" component={DisabledMinimalCustomText} />
        <Stack.Screen name="DisabledMinimalStyledText" component={DisabledMinimalStyledText} />

        <Stack.Screen name="CustomLongDefaultText" component={CustomLongDefaultText} />
        <Stack.Screen name="CustomDefaultTextWithLongTitle" component={CustomDefaultTextWithLongTitle} />
        <Stack.Screen name="CustomLongCustomText" component={CustomLongCustomText} />
        <Stack.Screen name="CustomCustomTextWithLongTitle" component={CustomCustomTextWithLongTitle} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
