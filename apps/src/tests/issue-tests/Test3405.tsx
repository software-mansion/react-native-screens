import { NavigationContainer } from '@react-navigation/native';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import { SettingsSwitch } from '../../shared/SettingsSwitch';
import Colors from '../../shared/styling/Colors';

interface Config {
  outerSavEnabled: boolean;
  innerSavEnabled: boolean;
  outerHeaderHidden: boolean;
  innerHeaderHidden: boolean;
}

interface ConfigContextInterface {
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
}

const ConfigContext = createContext<ConfigContextInterface | null>(null);

function useConfigContext() {
  const configContext = useContext(ConfigContext);

  if (!configContext) {
    throw new Error(
      'useConfigContext has to be used within <ConfigContest.Provider>',
    );
  }

  return configContext;
}

export default function App() {
  const [config, setConfig] = useState<Config>({
    outerSavEnabled: false,
    innerSavEnabled: false,
    outerHeaderHidden: false,
    innerHeaderHidden: false,
  });

  return (
    <NavigationContainer>
      <ConfigContext.Provider value={{ config, setConfig }}>
        <View style={{ flex: 1, backgroundColor: Colors.RedDark100 }}>
          <Outer />
        </View>
      </ConfigContext.Provider>
    </NavigationContainer>
  );
}

function Outer() {
  const { config } = useConfigContext();
  return (
    <SafeAreaView
      edges={{ top: config.outerSavEnabled }}
      style={{ backgroundColor: Colors.PurpleDark100 }}>
      <ScreenStack style={{ flex: 1 }}>
        <ScreenStackItem
          screenId="1"
          style={[
            StyleSheet.absoluteFill,
            { flex: 1, backgroundColor: Colors.BlueDark100 },
          ]}
          headerConfig={{ title: 'Outer', hidden: config.outerHeaderHidden }}>
          <Inner />
        </ScreenStackItem>
      </ScreenStack>
    </SafeAreaView>
  );
}

function Inner() {
  const { config } = useConfigContext();
  return (
    <SafeAreaView
      edges={{ top: config.innerSavEnabled }}
      style={{ backgroundColor: Colors.PurpleLight100 }}>
      <ScreenStack style={{ flex: 1 }}>
        <ScreenStackItem
          screenId="2"
          contentStyle={styles.content}
          headerConfig={{ title: 'Inner', hidden: config.innerHeaderHidden }}
          style={StyleSheet.absoluteFill}>
          <ConfigSettings />
        </ScreenStackItem>
      </ScreenStack>
    </SafeAreaView>
  );
}

function ConfigSettings() {
  const { config, setConfig } = useConfigContext();
  return (
    <>
      <Text style={styles.title}>Safe Area configuration</Text>
      <SettingsSwitch
        label="outerSavEnabled"
        value={config.outerSavEnabled}
        onValueChange={value =>
          setConfig({ ...config, outerSavEnabled: value })
        }
      />
      <SettingsSwitch
        label="innerSavEnabled"
        value={config.innerSavEnabled}
        onValueChange={value =>
          setConfig({ ...config, innerSavEnabled: value })
        }
      />
      <Text style={styles.title}>Header configuration</Text>
      <SettingsSwitch
        label="outerHeaderHidden"
        value={config.outerHeaderHidden}
        onValueChange={value =>
          setConfig({ ...config, outerHeaderHidden: value })
        }
      />
      <SettingsSwitch
        label="innerHeaderHidden"
        value={config.innerHeaderHidden}
        onValueChange={value =>
          setConfig({ ...config, innerHeaderHidden: value })
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.GreenDark100,
    gap: 5,
  },
});
