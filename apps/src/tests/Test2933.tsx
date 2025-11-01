import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Screen, ScreenStack } from 'react-native-screens';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): React.JSX.Element {
  return (
    <View style={styles.sectionContainer}>
      <Text>{title}</Text>
      <Text>{children}</Text>
    </View>
  );
}

function floodJsThread() {
  setInterval(() => {
    const end = Date.now() + 25;
    while (Date.now() < end) {
      // Intentionally do nothing; just burn CPU cycles.
      Math.sqrt(Math.random());
    }
  }, 27);
}

/*
 * create artificial pressure in the JS thread to show off thep problem.
 * */
floodJsThread();

function AppMain(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: 'white',
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={{
          flex: 1,
          paddingHorizontal: safePadding,
          paddingBottom: safePadding,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <Section title="Step One">
          This test shows how the native layout update triggers a layout shift.
        </Section>
        <Section title="Step One">
          There is a view with a blue background. We don't expect to ever see
          flashes of the blue background.
        </Section>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

function App() {
  return (
    <ScreenStack style={{ flex: 1, backgroundColor: 'red' }}>
      <Screen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: 'blue',
          padding: 20,
        }}
        enabled
        isNativeStack>
        <AppMain />
      </Screen>
    </ScreenStack>
  );
}

export default App;
