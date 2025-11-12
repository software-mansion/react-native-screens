import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LongText from '../shared/LongText';
import {
  ScreenStack,
  ScreenStackHeaderSearchBarView,
  ScreenStackItem,
  SearchBar,
  SearchBarPlacement,
} from 'react-native-screens';
import Colors from '../shared/styling/Colors';
import { SettingsPicker, SettingsSwitch } from '../shared';
import { NavigationContainer } from '@react-navigation/native';

interface NavigationProps {
  setShowTestScreen: Dispatch<SetStateAction<boolean>>;
}

interface Config {
  headerTransparent: boolean;
  headerLargeTitle: boolean;
  headerShown: boolean;
  searchBarPlacement: 'disabled' | SearchBarPlacement;
  searchBarHideNavigationBar: boolean;
  searchBarHideWhenScrolling: boolean;
  content: 'regularView' | 'scrollView';
  headerHeight: number;
}

export interface ConfigContextInterface {
  config: Config;
  setConfig: Dispatch<SetStateAction<Config>>;
}

export const ConfigContext = createContext<ConfigContextInterface | null>(null);

export const useConfigContext = () => {
  const ctx = useContext(ConfigContext);

  if (!ctx) {
    throw new Error(
      'useConfigContext has to be used within <ConfigContext.Provider>',
    );
  }

  return ctx;
};

function ConfigScreen({ setShowTestScreen }: NavigationProps) {
  const { config, setConfig } = useConfigContext();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 5 }}>
      <Text style={styles.title}>Stack configuration</Text>
      <SettingsSwitch
        label="headerTransparent"
        value={config.headerTransparent}
        onValueChange={value =>
          setConfig({ ...config, headerTransparent: value })
        }
      />
      <SettingsSwitch
        label="headerLargeTitle"
        value={config.headerLargeTitle}
        onValueChange={value =>
          setConfig({ ...config, headerLargeTitle: value })
        }
      />
      <SettingsSwitch
        label="headerShown"
        value={config.headerShown}
        onValueChange={value => setConfig({ ...config, headerShown: value })}
      />
      <Text style={styles.title}>Search bar configuration</Text>
      <SettingsPicker<Config['searchBarPlacement']>
        label="searchBarPlacement"
        value={config.searchBarPlacement}
        onValueChange={value =>
          setConfig({
            ...config,
            searchBarPlacement: value,
          })
        }
        items={[
          'disabled',
          'automatic',
          'inline',
          'stacked',
          'integrated',
          'integratedButton',
          'integratedCentered',
        ]}
      />
      <SettingsSwitch
        label="searchBarHideNavigationBar"
        value={config.searchBarHideNavigationBar}
        onValueChange={value =>
          setConfig({ ...config, searchBarHideNavigationBar: value })
        }
      />
      <SettingsSwitch
        label="searchBarHideWhenScrolling"
        value={config.searchBarHideWhenScrolling}
        onValueChange={value =>
          setConfig({ ...config, searchBarHideWhenScrolling: value })
        }
      />
      <Text style={styles.title}>Content configuration</Text>
      <SettingsPicker<Config['content']>
        label="content"
        value={config.content}
        onValueChange={value =>
          setConfig({
            ...config,
            content: value,
          })
        }
        items={['regularView', 'scrollView']}
      />
      <Button title="Push screen" onPress={() => setShowTestScreen(true)} />
    </ScrollView>
  );
}

function TestScreen({ setShowTestScreen }: NavigationProps) {
  const { config } = useConfigContext();

  const topContent = (
    <>
      <LongText size="xs" />
      <Button onPress={() => setShowTestScreen(false)} title="Back to config" />
    </>
  );

  switch (config.content) {
    case 'regularView':
      return <View>{topContent}</View>;
    case 'scrollView':
      return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {topContent}
          <LongText size="lg" />
        </ScrollView>
      );
  }
}

function Navigation() {
  const { config, setConfig } = useConfigContext();
  const [showTestScreen, setShowTestScreen] = useState(false);

  return (
    <>
      <ScreenStack style={{ flex: 1 }}>
        <ScreenStackItem
          screenId="config"
          headerConfig={{
            hidden: true,
          }}>
          <ConfigScreen setShowTestScreen={setShowTestScreen} />
        </ScreenStackItem>
        {showTestScreen && (
          <ScreenStackItem
            screenId="test"
            onHeaderHeightChange={e => {
              console.log(`[HeaderHeight] ${e.nativeEvent.headerHeight}`);
              setConfig({
                ...config,
                headerHeight: e.nativeEvent.headerHeight,
              });
            }}
            gestureEnabled={false}
            // mirrors react-navigation logic
            headerConfig={{
              hidden: config.headerShown === false,
              translucent:
                config.headerTransparent ||
                ((config.searchBarPlacement !== 'disabled' ||
                  config.headerLargeTitle) &&
                  Platform.OS === 'ios' &&
                  config.headerTransparent !== false),
              largeTitle: config.headerLargeTitle,
              title: 'Test Screen',
              hideBackButton: true,
              backgroundColor: config.headerTransparent
                ? 'transparent'
                : Colors.cardBackground,
              children:
                config.searchBarPlacement !== 'disabled' ? (
                  <ScreenStackHeaderSearchBarView>
                    <SearchBar
                      placement={config.searchBarPlacement}
                      hideNavigationBar={config.searchBarHideNavigationBar}
                      hideWhenScrolling={config.searchBarHideWhenScrolling}
                    />
                  </ScreenStackHeaderSearchBarView>
                ) : undefined,
            }}>
            <TestScreen setShowTestScreen={setShowTestScreen} />
          </ScreenStackItem>
        )}
      </ScreenStack>
      {showTestScreen && (
        <View
          style={{
            position: 'absolute',
            top: config.headerHeight,
            right: 10,
            width: 60,
            height: 60,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#D4EEE8CC',
          }}>
          <Text style={{ fontSize: 20 }}>{config.headerHeight.toFixed(1)}</Text>
        </View>
      )}
    </>
  );
}

export default function App() {
  const [config, setConfig] = useState<Config>({
    headerTransparent: false,
    headerLargeTitle: false,
    headerShown: true,
    searchBarPlacement: 'disabled',
    searchBarHideNavigationBar: true,
    searchBarHideWhenScrolling: true,
    content: 'regularView',
    headerHeight: 0,
  });

  return (
    <NavigationContainer>
      <ConfigContext.Provider value={{ config, setConfig }}>
        <Navigation />
      </ConfigContext.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
