import React, {useLayoutEffect} from 'react';
import {I18nManager, SafeAreaView, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {RouteProp} from '@react-navigation/native';
import {Button} from '../shared';

type StackParamList = {
  Details: {index: number};
};

interface DetailsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Details'>;
  route: RouteProp<StackParamList, 'Details'>;
}

const DetailsScreen = ({
  navigation,
  route,
}: DetailsScreenProps): JSX.Element => {
  const colors = [
    'snow',
    'cornsilk',
    'papayawhip',
    'bisque',
    'peachpuff',
    'orange',
    'coral',
    'orangered',
    'red',
  ];

  const index = route.params?.index ? route.params?.index : 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Details screen #${index}`,
    });
  }, [navigation]);

  const currentColor =
    index < colors.length ? colors[index] : colors[colors.length - 1];

  return (
    <SafeAreaView style={{...styles.container, backgroundColor: currentColor}}>
      <Button
        title={`More details ${index}`}
        onPress={() => navigation.push('Details', {index: index + 1})}
      />
      {index === 0 ? (
        <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
      ) : null}
    </SafeAreaView>
  );
};

const createStack = () => {
  const Stack = createNativeStackNavigator();

  const makeStack = () => (
    <Stack.Navigator
      screenOptions={{
        direction: I18nManager.isRTL ? 'rtl' : 'ltr',
      }}>
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );

  return makeStack;
};

const AStack = createStack();
const BStack = createStack();
const CStack = createStack();
const DStack = createStack();

const Tab = createBottomTabNavigator();

const NavigationTabsAndStack = (): JSX.Element => (
  <Tab.Navigator>
    <Tab.Screen name="A" component={AStack} />
    <Tab.Screen name="B" component={BStack} />
    <Tab.Screen name="C" component={CStack} />
    <Tab.Screen name="D" component={DStack} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
});

export default NavigationTabsAndStack;
