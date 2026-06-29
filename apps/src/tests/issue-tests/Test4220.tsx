import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Pressable,
  Switch,
  Platform,
  ScrollView,
} from 'react-native';
import {
  ScreenStack,
  ScreenStackItem,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderRightView,
} from 'react-native-screens';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface Config {
  disableTop: boolean;
  disableLeft: boolean;
  disableRight: boolean;
  disableBottom: boolean;
}

const INITIAL_CONFIG: Config = {
  disableTop: false,
  disableLeft: false,
  disableRight: false,
  disableBottom: false,
};

export function ControlPanel({
  config,
  setConfig,
}: {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}) {
  const rows: { key: keyof Config; label: string }[] = [
    { key: 'disableTop', label: 'disableTopInsetApplication' },
    { key: 'disableLeft', label: 'disableLeftInsetApplication' },
    { key: 'disableRight', label: 'disableRightInsetApplication' },
    { key: 'disableBottom', label: 'disableBottomInsetApplication' },
  ];

  return (
    <ScrollView
      style={styles.panel}
      contentContainerStyle={styles.panelContent}>
      <Text style={styles.text}>Details Screen</Text>
      <Text style={styles.subtext}>
        Native back button + Action button above. This header covers the Home
        header (only one is visible at a time).
      </Text>

      {rows.map(({ key, label }) => (
        <View key={key} style={styles.row}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Switch
            value={config[key]}
            onValueChange={value =>
              setConfig(prev => ({ ...prev, [key]: value }))
            }
          />
        </View>
      ))}

      {Platform.OS !== 'android' && (
        <Text style={styles.warning}>
          These props only take effect on Android.
        </Text>
      )}
    </ScrollView>
  );
}

export function TestContent() {
  const [config, setConfig] = useState<Config>(INITIAL_CONFIG);
  const [showDetails, setShowDetails] = useState(false);

  const headerInsetProps = {
    disableTopInsetApplication: config.disableTop,
    disableLeftInsetApplication: config.disableLeft,
    disableRightInsetApplication: config.disableRight,
    disableBottomInsetApplication: config.disableBottom,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenStack style={styles.container}>
        <ScreenStackItem
          screenId="home"
          headerConfig={{
            title: 'My App',
            backgroundColor: '#f4511e',
            color: '#fff',
            ...headerInsetProps,
          }}>
          <View style={styles.screen}>
            <Text style={styles.text}>Home Screen</Text>
            <Button
              title="Go to Details"
              onPress={() => setShowDetails(true)}
            />
          </View>
        </ScreenStackItem>

        {showDetails && (
          <ScreenStackItem
            screenId="details"
            headerConfig={{
              title: 'Details',
              backgroundColor: '#f4511e',
              color: '#fff',
              ...headerInsetProps,
              children: (
                <>
                  <ScreenStackHeaderLeftView>
                    <Pressable
                      onPress={() => setShowDetails(false)}
                      style={styles.backButton}>
                      <Text style={styles.backArrow}>←</Text>
                      <Text style={styles.backLabel}>Back</Text>
                    </Pressable>
                  </ScreenStackHeaderLeftView>
                  <ScreenStackHeaderRightView>
                    <Button
                      onPress={() => Alert.alert('Action triggered!')}
                      title="Action"
                      color="#fff"
                    />
                  </ScreenStackHeaderRightView>
                </>
              ),
            }}>
            <View style={styles.detailsScreen}>
              <ControlPanel config={config} setConfig={setConfig} />
            </View>
          </ScreenStackItem>
        )}
      </ScreenStack>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TestContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
  },
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  detailsScreen: {
    flex: 1,
    backgroundColor: '#e0f7fa',
  },
  panel: {
    flex: 1,
  },
  panelContent: {
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  rowLabel: {
    fontSize: 15,
    flexShrink: 1,
    marginRight: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  backArrow: {
    color: '#fff',
    fontSize: 24,
    marginRight: 5,
  },
  backLabel: {
    color: '#fff',
    fontSize: 16,
  },
  warning: {
    marginTop: 16,
    fontSize: 13,
    color: '#b00',
  },
});
