import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import { StyleSheet, View, ScrollView, RefreshControl, Button as RNButton, Modal } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export function Home() {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>Open up 'src/App.tsx' to start working on your app!</Text>
      <Button screen="Settings">Go to modal</Button>
      <RNButton title='Toggle modal' onPress={() => setModalVisible(true)} />
      <Modal visible={modalVisible} presentationStyle='formSheet' animationType='slide' >
        <Settings closeModal={() => setModalVisible(false)}/>
      </Modal>
    </View>
  );
}

export function Settings({ closeModal }: { closeModal?: () => void }) {
  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => {}} />
        }
      >
        <Text style={styles.text}>Empty List</Text>
        <RNButton title="Press me" onPress={() => console.log('Pressed!')} />
        {closeModal && (
          <RNButton title='Close modal' onPress={closeModal} />
        )}
      </ScrollView>
    </View>
  );
}


const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Feed',
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
    Settings: {
      screen: Settings,
      options: {
        presentation: 'modal',
        headerShown: false,
      },
    },
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  text: {
    width: '100%',
    padding: 10,
  },
});

//export const Navigation = createStaticNavigation(RootStack);
//

function HomeTabsComponent() {
  return (
    <HomeTabs.Navigator>
      <HomeTabs.Screen name="Home" component={Home} />
    </HomeTabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="JustHome">
        <RootStack.Screen name="HomeTabs" component={HomeTabsComponent} options={{
          headerShown: false,
        }}/>
        <RootStack.Screen name="JustHome" component={Home} options={{
          headerShown: true,
        }} />
        <RootStack.Screen name="Settings" component={Settings} options={{
          presentation: 'modal',
          headerShown: false,
        }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
