import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { Button, Dimensions, Text, View } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={TransparentModal} options={{  
          stackPresentation: 'transparentModal',
          headerMode: 'none',
          headerShown: false,

        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TransparentModal({navigation}) {
  const addedRoutes = navigation.dangerouslyGetState().routes.length - 1;
  const margin = addedRoutes * 20;
  const width = Dimensions.get("screen").width - addedRoutes * 40;
  const backgroundColor = colors[addedRoutes % colors.length]
  return (
    <View style={[{width, margin, backgroundColor, height: '100%', borderWidth: 2}]}>
      <Button
        title="Open transparent modal"
        onPress={() => navigation.push('First')}
      />
            <Text style={{padding: 10}}>For each modal you open, all previous modals should be visible underneath</Text> 
    </View>
  );
}

const colors = ['darkviolet', 'slateblue', 'mediumseagreen', 'khaki', 'orange', 'indianred']
