import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

// Uncomment these lines if you want to test useAnimatedHeaderHeight.
import { Animated } from 'react-native';
import { useAnimatedHeaderHeight } from 'react-native-screens/native-stack';

// Uncomment these lines if you want to test useReanimatedHeaderHeight.
// import Animated from 'react-native-reanimated';
// import { useReanimatedHeaderHeight } from 'react-native-screens/reanimated';

import {
  GestureHandlerRootView,
  ScrollView,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { ReanimatedScreenProvider } from 'react-native-screens/reanimated';
import { FullWindowOverlay } from 'react-native-screens';

const Stack = createNativeStackNavigator();

function ExampleScreen() {
  const headerHeight = useAnimatedHeaderHeight();
  // const headerHeight = useReanimatedHeaderHeight();

  return (
    <FullWindowOverlay>
      <Animated.View
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',

          backgroundColor: 'red',
          width: '100%',
          opacity: 0.5,
          height: 60,
          zIndex: 1,
          transform: [
            {
              translateY: headerHeight,
            },
          ],
        }}>
        <Text>I'm a header!</Text>
      </Animated.View>
    </FullWindowOverlay>
  );
}

const enablePerformanceTests = false;

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <ExampleScreen />
      <Post onPress={() => navigation.navigate('Second')} />
      <Post onPress={() => navigation.navigate('Second')} />
      <Post onPress={() => navigation.navigate('Second')} />
      {
        // Generate 1000 posts for performance testing.
        enablePerformanceTests &&
          Array(1000)
            .fill(0)
            .map(_ => <Post onPress={() => navigation.navigate('Second')} />)
      }
    </ScrollView>
  );
}

function Second() {
  return (
    <ScrollView>
      <ExampleScreen />
      <Text style={styles.subTitle}>
        Use swipe back gesture to go back (iOS only)
      </Text>
      <Post />
    </ScrollView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReanimatedScreenProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              fullScreenSwipeEnabled: true,
              stackAnimation: 'fade_from_bottom',
              customAnimationOnSwipe: true,
              headerLargeTitle: true,
              // headerTranslucent: true,
            }}>
            <Stack.Screen name="First" component={First} />
            <Stack.Screen name="Second" component={Second} />
          </Stack.Navigator>
        </NavigationContainer>
      </ReanimatedScreenProvider>
    </GestureHandlerRootView>
  );
}

// components

function Post({ onPress }: { onPress?: () => void }) {
  const [width] = React.useState(Math.round(Dimensions.get('screen').width));

  return (
    <TapGestureHandler
      onHandlerStateChange={e =>
        e.nativeEvent.oldState === State.ACTIVE && onPress?.()
      }>
      <View style={styles.post}>
        <Text style={styles.title}>Post</Text>
        <ScrollView horizontal>{generatePhotos(4, width, 400)}</ScrollView>
        <Text style={styles.caption}>Scroll right for more photos</Text>
      </View>
    </TapGestureHandler>
  );
}

// helpers
function generatePhotos(
  amount: number,
  width: number,
  height: number,
): JSX.Element[] {
  const startFrom = Math.floor(Math.random() * 20) + 10;
  return Array.from({ length: amount }, (_, index) => {
    const uri = `https://picsum.photos/id/${
      startFrom + index
    }/${width}/${height}`;
    return <Image style={{ width, height }} key={uri} source={{ uri }} />;
  });
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 32,
    marginBottom: 8,
    marginLeft: 8,
  },
  subTitle: {
    fontSize: 18,
    marginVertical: 16,
    textAlign: 'center',
  },
  caption: {
    textAlign: 'center',
    marginTop: 4,
  },
  post: {
    borderColor: '#ccc',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: 'white',
  },
});
