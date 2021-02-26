import React, {useLayoutEffect} from 'react';
import {SafeAreaView, Button, StyleSheet} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {RouteProp} from '@react-navigation/native';
import {Spacer} from '../shared';

enableScreens();

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
  const index = route.params?.index ? route.params?.index : 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Details screen #${index}`,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Spacer>
        <Button
          title={`More details ${index}`}
          onPress={() => navigation.push('Details', {index: index + 1})}
        />
      </Spacer>
      {index === 0 ? (
        <Spacer>
          <Button
            onPress={() => navigation.pop()}
            title="🔙 Back to Examples"
          />
        </Spacer>
      ) : null}
    </SafeAreaView>
  );
};

const createStack = () => {
  const Stack = createNativeStackNavigator();

  const makeStack = () => (
    <Stack.Navigator>
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
