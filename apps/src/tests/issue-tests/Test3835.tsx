import React, { createContext, ReactNode, useContext, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

interface HeaderConfigContextType {
  tabShown: boolean;
  setTabShown: React.Dispatch<React.SetStateAction<boolean>>;
  outerShown: boolean;
  setOuterShown: React.Dispatch<React.SetStateAction<boolean>>;
  innerShown: boolean;
  setInnerShown: React.Dispatch<React.SetStateAction<boolean>>;
  disableInset: boolean;
  setDisableInset: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderConfigContext = createContext<HeaderConfigContextType | null>(null);

const useHeaderConfig = () => {
  const context = useContext(HeaderConfigContext);
  if (!context) {
    throw new Error(
      'useHeaderConfig must be used within a HeaderConfigProvider',
    );
  }
  return context;
};

interface HeaderConfigProviderProps {
  children: ReactNode;
}

const HeaderConfigProvider = ({ children }: HeaderConfigProviderProps) => {
  const [tabShown, setTabShown] = useState(true);
  const [outerShown, setOuterShown] = useState(true);
  const [innerShown, setInnerShown] = useState(true);
  const [disableInset, setDisableInset] = useState(true);

  return (
    <HeaderConfigContext.Provider
      value={{
        tabShown,
        setTabShown,
        outerShown,
        setOuterShown,
        innerShown,
        setInnerShown,
        disableInset,
        setDisableInset,
      }}>
      {children}
    </HeaderConfigContext.Provider>
  );
};

const ControlPanel = () => {
  const config = useHeaderConfig();

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Headers Config</Text>

      <View style={styles.row}>
        <Text style={styles.text}>Tab Navigator</Text>
        <Switch value={config.tabShown} onValueChange={config.setTabShown} />
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.text}>Outer Stack</Text>
        <Switch
          value={config.outerShown}
          onValueChange={config.setOuterShown}
        />
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.text}>Inner Stack</Text>
        <Switch
          value={config.innerShown}
          onValueChange={config.setInnerShown}
        />
      </View>
      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.text}>Disable Top Inset</Text>
        <Switch
          value={config.disableInset}
          onValueChange={config.setDisableInset}
        />
      </View>
    </View>
  );
};

const Home = () => (
  <View style={styles.container}>
    <Text style={styles.screenTitle}>Home Screen</Text>
    <ControlPanel />
  </View>
);

const OuterStack = createNativeStackNavigator();
const InnerStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const NestedStack = () => {
  const config = useHeaderConfig();

  return (
    <InnerStack.Navigator
      screenOptions={{
        title: 'Inner Stack',
        headerShown: config.innerShown,
        disableTopInsetConsumption: config.disableInset,
      }}>
      <InnerStack.Screen name="Home" component={Home} />
    </InnerStack.Navigator>
  );
};

const MainStack = () => {
  const config = useHeaderConfig();

  return (
    <OuterStack.Navigator
      screenOptions={{
        title: 'Outer Stack',
        headerShown: config.outerShown,
        disableTopInsetConsumption: config.disableInset,
      }}>
      <OuterStack.Screen name="NestedStack" component={NestedStack} />
    </OuterStack.Navigator>
  );
};

const AppContent = () => {
  const config = useHeaderConfig();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          title: 'Tab Nav',
          headerShown: config.tabShown,
        }}>
        <Tab.Screen name="Tab" component={MainStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <HeaderConfigProvider>
      <AppContent />
    </HeaderConfigProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  panel: {
    backgroundColor: '#FFF',
    padding: 20,
    width: '100%',
    maxWidth: 350,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
});
