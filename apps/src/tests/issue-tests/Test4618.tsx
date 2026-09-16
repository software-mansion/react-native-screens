// @ts-nocheck — TVEventControl / useTVEventHandler / Pressable focused state are tvOS-only.

import React from 'react';
import {
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TVEventControl,
  useTVEventHandler,
  View,
} from 'react-native';
import {
  Screen,
  ScreenStack,
  ScreenStackHeaderConfig,
} from 'react-native-screens';

/**
 * #4618 — tvOS Menu key on pushed native-stack screens.
 *
 * Manual test matrix: see `PR-4618-tvos-menu-key.md` at repo root.
 * Toggle the flags below, reload, and run each case on Apple TV.
 */
const DISABLE_DEFAULT_MENU_ACTION = true;

function useMenuKeyProbe() {
  const [backHandlerCount, setBackHandlerCount] = React.useState(0);
  const [tvEventCount, setTVEventCount] = React.useState(0);

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setBackHandlerCount(count => count + 1);
        return true;
      },
    );

    return () => subscription.remove();
  }, []);

  useTVEventHandler(event => {
    if (event.eventType === 'menu') {
      setTVEventCount(count => count + 1);
    }
  });

  return { backHandlerCount, tvEventCount };
}

function MenuKeyCounters() {
  const { backHandlerCount, tvEventCount } = useMenuKeyProbe();

  return (
    <View style={styles.counters}>
      <Text style={styles.counterText}>
        BackHandler saw: {backHandlerCount}
      </Text>
      <Text style={styles.counterText}>
        useTVEventHandler saw: {tvEventCount}
      </Text>
    </View>
  );
}

type ActionButtonProps = {
  label: string;
  onPress: () => void;
};

function ActionButton({ label, onPress }: ActionButtonProps) {
  return (
    <Pressable
      style={({ focused }) => [styles.button, focused && styles.buttonFocused]}
      onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

export default function Test4618() {
  const [showDetail, setShowDetail] = React.useState(false);

  // React.useEffect(() => {
  //   TVEventControl.enableTVMenuKey();
  //   return () => TVEventControl.disableTVMenuKey();
  // }, []);

  const popToHome = () => setShowDetail(false);

  return (
    <View style={styles.root}>
      <ScreenStack
        style={styles.stack}
        disableDefaultMenuAction={DISABLE_DEFAULT_MENU_ACTION}>
        <Screen
          key="home"
          activityState={2}
          isNativeStack
          style={StyleSheet.absoluteFill}>
          <ScreenStackHeaderConfig title="Home (depth 1)" />
          <View style={styles.screen}>
            <MenuKeyCounters />
            <Text style={styles.bodyText}>
              {Platform.isTV
                ? 'Push Detail, then press Menu on the remote.'
                : 'tvOS-only manual test — open on Apple TV.'}
            </Text>
            <ActionButton
              label="Push Detail"
              onPress={() => setShowDetail(true)}
            />
          </View>
        </Screen>
        {showDetail && (
          <Screen
            key="detail"
            activityState={2}
            isNativeStack
            style={StyleSheet.absoluteFill}
            onDismissed={popToHome}>
            <ScreenStackHeaderConfig title="Detail (depth 2)" />
            <View style={[styles.screen, styles.detailScreen]}>
              <MenuKeyCounters />
              <Text style={styles.bodyText}>
                Menu should increment counters and not auto-pop this screen.
              </Text>
              <ActionButton label="Pop (JS)" onPress={popToHome} />
            </View>
          </Screen>
        )}
      </ScreenStack>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stack: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  detailScreen: {
    backgroundColor: '#f3f0ff',
  },
  bodyText: {
    color: '#111111',
    fontSize: Platform.isTV ? 28 : 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  counters: {
    alignItems: 'center',
    marginBottom: 24,
  },
  counterText: {
    color: '#0a7a36',
    fontSize: Platform.isTV ? 32 : 18,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2b2b33',
    paddingHorizontal: 32,
    paddingVertical: Platform.isTV ? 20 : 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonFocused: {
    backgroundColor: '#4c8dff',
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: Platform.isTV ? 28 : 16,
    fontWeight: '600',
  },
});
