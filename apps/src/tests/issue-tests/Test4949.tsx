import React from 'react';
import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
  useNavigationState,
  type NavigatorScreenParams,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type InnerStackParamList = {
  List: undefined;
  InnerSheet: undefined;
};

type RootStackParamList = {
  Home: NavigatorScreenParams<InnerStackParamList> | undefined;
  OuterSheet: undefined;
  OuterSheetNoAnimation: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const InnerStack = createNativeStackNavigator<InnerStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

let innerNavigation: NativeStackNavigationProp<InnerStackParamList> | null =
  null;
let setInnerStackMounted: ((mounted: boolean) => void) | null = null;

function openInnerSheet() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Home', { screen: 'InnerSheet' });
  }
}

function openInnerSheetAfter(delay: number) {
  setTimeout(openInnerSheet, delay);
}

function ListScreen({
  navigation,
}: NativeStackScreenProps<InnerStackParamList, 'List'>) {
  innerNavigation = navigation;
  const routes = useNavigationState(state => state.routes.map(r => r.name));
  const [rnModalVisible, setRNModalVisible] = React.useState(false);

  return (
    <ScrollView contentContainerStyle={styles.screen} testID="test4949-list">
      <Text style={styles.description}>
        Open the outer sheet (root stack), then close it and open the inner
        sheet (nested stack) with one of its buttons. The stacks update in no
        fixed order, so try the one-update cases a few times.{'\n'}
        Expected: the inner sheet appears and stays.{'\n'}
        Bug: no sheet, although the inner stack state has InnerSheet.
      </Text>
      <Text style={styles.state} testID="test4949-inner-routes">
        Inner stack: {JSON.stringify(routes)}
      </Text>
      <Button
        title="Open outer sheet"
        testID="test4949-open-outer-sheet"
        onPress={() => navigationRef.navigate('OuterSheet')}
      />
      <Button
        title="Open outer sheet (no animation)"
        testID="test4949-open-outer-sheet-no-animation"
        onPress={() => navigationRef.navigate('OuterSheetNoAnimation')}
      />
      <Button
        title="Open inner sheet"
        testID="test4949-open-inner-sheet"
        onPress={() => navigation.navigate('InnerSheet')}
      />
      <Button
        title="Open outer sheet, close it while opening and open inner sheet"
        testID="test4949-outer-sheet-still-opening"
        onPress={() => {
          navigationRef.navigate('OuterSheet');
          setTimeout(() => {
            navigationRef.goBack();
            openInnerSheet();
          }, 100);
        }}
      />
      <Button
        title="Show React Native modal"
        testID="test4949-show-rn-modal"
        onPress={() => setRNModalVisible(true)}
      />
      <Modal visible={rnModalVisible} animationType="slide">
        <View style={styles.rnModal} testID="test4949-rn-modal">
          <Text style={styles.title}>React Native modal</Text>
          <Button
            title="Close modal and open inner sheet"
            testID="test4949-close-rn-modal-open-inner-sheet"
            onPress={() => {
              setRNModalVisible(false);
              navigation.navigate('InnerSheet');
            }}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

function InnerSheetScreen({
  navigation,
}: NativeStackScreenProps<InnerStackParamList, 'InnerSheet'>) {
  return (
    <View style={styles.sheet} testID="test4949-inner-sheet">
      <Text style={styles.title}>Inner sheet (nested stack)</Text>
      <Button
        title="Close"
        testID="test4949-close-inner-sheet"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

function OuterSheetScreen({
  navigation,
}: NativeStackScreenProps<
  RootStackParamList,
  'OuterSheet' | 'OuterSheetNoAnimation'
>) {
  return (
    <View style={styles.sheet} testID="test4949-outer-sheet">
      <Text style={styles.title}>Outer sheet (root stack)</Text>
      <Button
        title="Close, then open inner sheet at once"
        testID="test4949-close-open-inner-sheet"
        onPress={() => {
          navigation.goBack();
          openInnerSheetAfter(0);
        }}
      />
      <Button
        title="Close and open inner sheet in one update"
        testID="test4949-close-open-inner-sheet-same-update"
        onPress={() => {
          navigation.goBack();
          openInnerSheet();
        }}
      />
      <Button
        title="Close and open preloaded inner sheet in one update"
        testID="test4949-close-open-preloaded-inner-sheet"
        onPress={() => {
          // Activating a preloaded screen updates the nested stack synchronously, during the mount transaction,
          // so it runs before the root stack's update.
          if (innerNavigation == null) {
            throw new Error('Test4949: the nested stack is not mounted');
          }
          innerNavigation.preload('InnerSheet');
          setTimeout(() => {
            navigation.goBack();
            openInnerSheet();
          }, 300);
        }}
      />
      <Button
        title="Close, open inner sheet and remount the nested stack"
        testID="test4949-close-open-inner-sheet-remount"
        onPress={() => {
          navigation.goBack();
          openInnerSheet();
          setTimeout(() => setInnerStackMounted?.(false), 50);
          setTimeout(() => setInnerStackMounted?.(true), 600);
        }}
      />
      <Button
        title="Close, then open inner sheet after 1 s"
        testID="test4949-close-open-inner-sheet-delayed"
        onPress={() => {
          navigation.goBack();
          openInnerSheetAfter(1000);
        }}
      />
    </View>
  );
}

function Home() {
  const [mounted, setMounted] = React.useState(true);
  setInnerStackMounted = setMounted;
  if (!mounted) {
    return (
      <View style={styles.screen} testID="test4949-inner-stack-unmounted" />
    );
  }
  return (
    <InnerStack.Navigator>
      <InnerStack.Screen name="List" component={ListScreen} />
      <InnerStack.Screen
        name="InnerSheet"
        component={InnerSheetScreen}
        options={{ presentation: 'formSheet', sheetAllowedDetents: [0.4] }}
      />
    </InnerStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="OuterSheet"
          component={OuterSheetScreen}
          options={{ presentation: 'formSheet', sheetAllowedDetents: [0.5] }}
        />
        <RootStack.Screen
          name="OuterSheetNoAnimation"
          component={OuterSheetScreen}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.5],
            animation: 'none',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    gap: 8,
  },
  sheet: {
    padding: 16,
    gap: 8,
  },
  rnModal: {
    flex: 1,
    padding: 32,
    paddingTop: 120,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
  },
  state: {
    fontFamily: 'Menlo',
    fontSize: 12,
  },
});
