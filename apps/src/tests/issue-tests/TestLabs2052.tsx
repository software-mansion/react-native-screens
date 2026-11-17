import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, ScrollView, Text, View } from 'react-native';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens-labs/issues/2052
//
// A form sheet must not keep using a content wrapper that belonged to a nested
// screen after that screen is gone.
//
// 1. "Open form sheet": the sheet hosts its own native stack. The nested
//    screen's RNSScreenContentWrapper registers with the sheet.
// 2. "Finish step": the sheet replaces the nested stack with plain content and
//    stays presented. Fabric recycles the nested screen's content wrapper.
// 3. "Push list beneath": pushes List in the stack nested in Home, beneath the
//    sheet. Fabric reuses the most recently recycled content wrapper for List.
// 4. "Shrink sheet": resizes the sheet, which runs its scroll view correction.
//
// Expected: the blue list beneath the sheet still fills its screen.
// Bug: the sheet sizes List's ScrollView to its own size, so the blue list
// ends at the sheet's height and white shows below it.

type RootStackParamList = {
  Home: undefined;
  Sheet: undefined;
};

type HomeStackParamList = {
  HomeMain: undefined;
  List: undefined;
};

type SheetStackParamList = {
  Step: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SheetStack = createNativeStackNavigator<SheetStackParamList>();

// Navigating from the sheet to a screen of the root stack would present it
// above the sheet, so the sheet pushes List in Home's stack through this ref.
const pushListBeneathSheet: { current: (() => void) | null } = {
  current: null,
};

const FinishStepContext = React.createContext<() => void>(() => {});

function HomeMain({
  navigation,
}: {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;
}) {
  React.useEffect(() => {
    // `navigate` would also focus Home in the root stack, which closes the
    // sheet. `push` does not change the focused route of the parent.
    pushListBeneathSheet.current = () => navigation.push('List');
    return () => {
      pushListBeneathSheet.current = null;
    };
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
      }}>
      <Button
        title="Open form sheet"
        onPress={() =>
          navigation
            .getParent<NativeStackNavigationProp<RootStackParamList>>()
            .navigate('Sheet')
        }
        testID="home-open-sheet"
      />
    </View>
  );
}

function List() {
  return (
    <ScrollView
      style={{ backgroundColor: Colors.BlueLight40 }}
      contentInsetAdjustmentBehavior="automatic"
      testID="list-scroll-view">
      {Array.from({ length: 40 }, (_, index) => (
        <Text key={index} style={{ padding: 12 }}>
          Row {index}
        </Text>
      ))}
    </ScrollView>
  );
}

function Home() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeMain}
        options={{ title: 'Home' }}
      />
      <HomeStack.Screen
        name="List"
        component={List}
        options={{
          title: 'List',
          contentStyle: { backgroundColor: Colors.White },
        }}
      />
    </HomeStack.Navigator>
  );
}

function Step() {
  const finishStep = React.useContext(FinishStepContext);
  return (
    <View style={{ padding: 24, backgroundColor: Colors.White }}>
      <Button
        title="Finish step"
        onPress={finishStep}
        testID="sheet-finish-step"
      />
    </View>
  );
}

function Sheet({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Sheet'>;
}) {
  const [isStepFinished, setIsStepFinished] = React.useState(false);
  const finishStep = React.useCallback(() => setIsStepFinished(true), []);

  if (!isStepFinished) {
    return (
      <FinishStepContext.Provider value={finishStep}>
        <SheetStack.Navigator>
          <SheetStack.Screen
            name="Step"
            component={Step}
            options={{ title: 'Step 1' }}
          />
        </SheetStack.Navigator>
      </FinishStepContext.Provider>
    );
  }

  return (
    <View style={{ padding: 24, gap: 12, backgroundColor: Colors.White }}>
      <Text>The nested stack is gone, the sheet is still presented.</Text>
      <Button
        title="Push list beneath"
        onPress={() => pushListBeneathSheet.current?.()}
        testID="sheet-push-list"
      />
      <Button
        title="Shrink sheet"
        onPress={() => navigation.setOptions({ sheetAllowedDetents: [0.4] })}
        testID="sheet-shrink"
      />
    </View>
  );
}

export default function TestLabs2052() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Sheet"
          component={Sheet}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [1],
            sheetLargestUndimmedDetentIndex: 'last',
            headerShown: false,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
