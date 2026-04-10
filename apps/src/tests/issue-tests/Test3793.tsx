import React, { createContext, ReactNode, useContext, useState } from 'react';
import { View, Text, StyleSheet, Button, Switch } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../../shared/styling/Colors';

interface HeaderConfigContextType {
  outerShown: boolean;
  setOuterShown: React.Dispatch<React.SetStateAction<boolean>>;
  middleShown: boolean;
  setMiddleShown: React.Dispatch<React.SetStateAction<boolean>>;
  innerShown: boolean;
  setInnerShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderConfigContext = createContext<HeaderConfigContextType | null>(null);

const useHeaderConfig = () => {
  const context = useContext(HeaderConfigContext);
  if (!context) {
    throw new Error('useHeaderConfig must be used within a HeaderConfigProvider');
  }
  return context;
};

interface HeaderConfigProviderProps {
  children: ReactNode;
}

const HeaderConfigProvider = ({ children }: HeaderConfigProviderProps) => {
  const [outerShown, setOuterShown] = useState(true);
  const [middleShown, setMiddleShown] = useState(true);
  const [innerShown, setInnerShown] = useState(true);

  return (
    <HeaderConfigContext.Provider
      value={{
        outerShown,
        setOuterShown,
        middleShown,
        setMiddleShown,
        innerShown,
        setInnerShown,
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
        <Text style={styles.text}>Outer Header</Text>
        <Switch
          value={config.outerShown}
          onValueChange={config.setOuterShown}
          trackColor={{ false: Colors.NavyLight20, true: Colors.GreenLight100 }}
          thumbColor={Colors.White}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.text}>Middle Header</Text>
        <Switch
          value={config.middleShown}
          onValueChange={config.setMiddleShown}
          trackColor={{ false: Colors.NavyLight20, true: Colors.BlueLight100 }}
          thumbColor={Colors.White}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.text}>Inner Header</Text>
        <Switch
          value={config.innerShown}
          onValueChange={config.setInnerShown}
          trackColor={{
            false: Colors.NavyLight20,
            true: Colors.YellowLight100,
          }}
          thumbColor={Colors.White}
        />
      </View>
    </View>
  );
};

const Screen = ({
  title,
  onNavigateInner,
  onNavigateMiddle,
  onNavigateOuter,
}: any) => (
  <View style={styles.container}>
    <Text style={styles.screenTitle}>{title} Screen</Text>
    <View style={styles.navButtons}>
      {onNavigateInner && (
        <Button
          title="Go to Inner 2"
          onPress={onNavigateInner}
          color={Colors.YellowLight100}
        />
      )}
      {onNavigateMiddle && (
        <Button
          title="Go to Middle 2"
          onPress={onNavigateMiddle}
          color={Colors.BlueLight100}
        />
      )}
      {onNavigateOuter && (
        <Button
          title="Go to Outer 2"
          onPress={onNavigateOuter}
          color={Colors.GreenLight100}
        />
      )}
    </View>

    <ControlPanel />
  </View>
);

const InnerStack = createNativeStackNavigator();
const MiddleStack = createNativeStackNavigator();
const OuterStack = createNativeStackNavigator();

const InnerNavigator = ({ navigation }: any) => {
  const config = useHeaderConfig();

  return (
    <InnerStack.Navigator
      screenOptions={{
        title: 'Inner',
        headerShown: config.innerShown,
        headerStyle: { backgroundColor: Colors.YellowLight80 },
        contentStyle: { backgroundColor: Colors.YellowLight40 },
      }}>
      <InnerStack.Screen name="Inner1">
        {props => (
          <Screen
            title="Inner 1"
            onNavigateInner={() => props.navigation.navigate('Inner2')}
            onNavigateMiddle={() => navigation.navigate('Middle2')}
            onNavigateOuter={() => navigation.getParent()?.navigate('Outer2')}
          />
        )}
      </InnerStack.Screen>
      <InnerStack.Screen name="Inner2">
        {_ => (
          <Screen
            title="Inner 2"
            onNavigateMiddle={() => navigation.navigate('Middle2')}
            onNavigateOuter={() => navigation.getParent()?.navigate('Outer2')}
          />
        )}
      </InnerStack.Screen>
    </InnerStack.Navigator>
  );
};

const MiddleNavigator = ({ navigation }: any) => {
  const config = useHeaderConfig();

  return (
    <MiddleStack.Navigator
      screenOptions={{
        title: 'Middle',
        headerShown: config.middleShown,
        headerStyle: { backgroundColor: Colors.BlueLight80 },
        contentStyle: { backgroundColor: Colors.BlueLight40 },
      }}>
      <MiddleStack.Screen name="Middle1_Container" component={InnerNavigator} />
      <MiddleStack.Screen name="Middle2">
        {_ => (
          <Screen
            title="Middle 2"
            onNavigateOuter={() => navigation.navigate('Outer2')}
          />
        )}
      </MiddleStack.Screen>
    </MiddleStack.Navigator>
  );
};

const OuterNavigator = () => {
  const config = useHeaderConfig();

  return (
    <OuterStack.Navigator
      screenOptions={{
        title: 'Outer',
        headerShown: config.outerShown,
        headerStyle: { backgroundColor: Colors.GreenLight80 },
        contentStyle: { backgroundColor: Colors.GreenLight40 },
      }}>
      <OuterStack.Screen name="Outer1_Container" component={MiddleNavigator} />
      <OuterStack.Screen name="Outer2">
        {() => <Screen title="Outer 2" />}
      </OuterStack.Screen>
    </OuterStack.Navigator>
  );
};

export default function App() {
  return (
    <HeaderConfigProvider>
      <NavigationContainer>
        <OuterNavigator />
      </NavigationContainer>
    </HeaderConfigProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.NavyDark140,
  },
  navButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40,
  },
  panel: {
    backgroundColor: Colors.WhiteTransparentDark,
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 350,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.NavyDark140,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  text: {
    color: Colors.NavyDark100,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.NavyLight40,
    marginVertical: 15,
  },
});
