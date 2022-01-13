import * as React from 'react';
import {View, Text, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({navigation}) {
  const [translucent, setTranslucent] = React.useState(false);
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text>This are details</Text>,
      headerLeft: () => (
        <Button title="< back" onPress={() => navigation.goBack()} />
      ),
      headerRight: () => (
        <View>
          <Text>Right</Text>
        </View>
      ),
      headerShown: show,
      headerTransparent: translucent,
    });
  }, [navigation, translucent, show]);
  return (
    <View style={{flex: 1, paddingTop: 50}}>
      <View style={{flex: 1, backgroundColor: '#0F0'}}>
        <Button
          title={`Turn translucent ${translucent ? 'off' : 'on'}`}
          onPress={() => setTranslucent(prev => !prev)}
        />
        <Button
          title={`${show ? 'Hide' : 'Show'} header`}
          onPress={() => setShow(prev => !prev)}
        />
      </View>
      <View style={{flex: 1, backgroundColor: '#00F'}}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            headerTitle: () => <Text>Set from options</Text>,
            headerLeft: () => (
              <View>
                <Text>LeftO</Text>
              </View>
            ),
            headerRight: () => (
              <View>
                <Text>RightO</Text>
              </View>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
