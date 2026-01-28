import React, { useRef, useState } from 'react';
import {
  Button,
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import Colors from '../shared/styling/Colors';
import PressableWithFeedback from '../shared/PressableWithFeedback';

type StackParamList = {
  Home: undefined;
  FormSheet: { useAnimated: boolean };
};

const Stack = createNativeStackNavigator<StackParamList>();

const HomeScreen = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
  const [useAnimated, setUseAnimated] = useState(false);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Open Form Sheet"
        onPress={() => navigation.navigate('FormSheet', { useAnimated })}
      />
      <Button
        title={`Using custom animation: ${useAnimated ? 'YES' : 'NO'}`}
        onPress={() => setUseAnimated(prev => !prev)}
      />
    </View>
  );
};

const FormSheetScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<StackParamList, 'FormSheet'>) => {
  const { useAnimated } = route.params;

  const [showTopView, setShowTopView] = useState(false);
  const [showBottomView, setShowBottomView] = useState(false);
  const [rectangleHeight, setRectangleHeight] = useState(200);
  const animatedRectangleHeight = useRef(new Animated.Value(200)).current;
  const currentAnimatedRectangleHeight = useRef(200);

  const toggleTopView = () => setShowTopView(prev => !prev);
  const toggleBottomView = () => setShowBottomView(prev => !prev);
  const toggleRectangleHeight = () =>
    setRectangleHeight(prev => (prev === 200 ? 400 : 200));

  const toggleAnimatedRectangleHeight = () => {
    const newHeight =
      currentAnimatedRectangleHeight.current === 200 ? 400 : 200;
    Animated.timing(animatedRectangleHeight, {
      toValue: newHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      currentAnimatedRectangleHeight.current = newHeight;
    });
  };

  return (
    <View style={styles.formSheetContainer}>
      {showTopView && (
        <View style={styles.rectangle}>
          <TextInput style={styles.input} />
          <PressableWithFeedback>
            <Text style={styles.text}>Top View</Text>
          </PressableWithFeedback>
        </View>
      )}
      <Text style={styles.formSheetTitle}>Form Sheet Content</Text>
      {useAnimated ? (
        <Animated.View
          style={[styles.rectangle, { height: animatedRectangleHeight }]}
        />
      ) : (
        <View style={[styles.rectangle, { height: rectangleHeight }]} />
      )}

      <Button
        title={showTopView ? 'Hide Top View' : 'Show Top View'}
        onPress={toggleTopView}
      />
      {useAnimated ? (
        <Button
          title={`Toggle Animated Rectangle Height (Current: ${currentAnimatedRectangleHeight.current}px)`}
          onPress={toggleAnimatedRectangleHeight}
        />
      ) : (
        <Button
          title={`Toggle Height (Current: ${rectangleHeight}px)`}
          onPress={toggleRectangleHeight}
        />
      )}
      <Button
        title={showBottomView ? 'Hide Bottom View' : 'Show Bottom View'}
        onPress={toggleBottomView}
      />
      <Button title="Dismiss" onPress={() => navigation.goBack()} />
      {showBottomView && (
        <View style={styles.rectangle}>
          <PressableWithFeedback>
            <Text style={styles.text}>Bottom View</Text>
          </PressableWithFeedback>
        </View>
      )}
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="FormSheet"
          component={FormSheetScreen}
          options={({ route }) => ({
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            contentStyle: {
              backgroundColor: Colors.YellowLight40,
            },
            sheetResizeAnimationEnabled: !route.params.useAnimated,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  formSheetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  formSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.White,
  },
  rectangle: {
    width: '100%',
    backgroundColor: Colors.NavyLight80,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 100,
    height: 20,
    borderColor: Colors.BlueDark100,
    borderWidth: 1,
  },
});
