import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import Animated, { AnimatedScreenTransition } from 'react-native-reanimated';
import { GestureDetectorProvider } from 'react-native-screens/gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type StackParamList = {
  Main: undefined;
  Story: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const stories = [
  require('./src/assets/appjs/1.jpg'),
  require('./src/assets/appjs/2.jpg'),
  require('./src/assets/appjs/3.jpg'),
  require('./src/assets/appjs/4.jpg'),
];

const posts = [
  require('./src/assets/appjs/5.jpg'),
  require('./src/assets/appjs/6.jpg'),
];

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView>
        <Text style={[styles.header]}>Screen Transitions</Text>
        <ScrollView contentContainerStyle={styles.row} horizontal>
          {stories.map(image => (
            <Pressable
              onPress={() => navigation.navigate('Story', { image })}
              style={{ height: 100 }}
              key={image}>
              <View style={styles.border}>
                <Animated.Image
                  style={[styles.image]}
                  source={image}
                  sharedTransitionTag={String(image)}></Animated.Image>
              </View>
            </Pressable>
          ))}
        </ScrollView>
        {posts.map(image => (
          <Post key={image} image={image} />
        ))}
      </ScrollView>
    </View>
  );
};

function User() {
  return (
    <View style={styles.userRow}>
      <Image
        source={require('./src/assets/appjs/7.jpg')}
        style={styles.userAvatar}
      />
      <View>
        <Text style={styles.username}>swmansion</Text>
        <Text style={styles.location}>App.js, Kraków</Text>
      </View>
    </View>
  );
}

function Post({ image }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <User />
      <Animated.Image
        source={image}
        style={{
          height: Dimensions.get('window').width,
          width: Dimensions.get('window').width,
        }}
      />
    </View>
  );
}

const StoryScreen = ({ route }) => {
  const [tag, setTag] = React.useState(route.params.image);

  useEffect(() => {
    setTag('');
    return () => {
      setTag(route.params.image);
    };
  });

  return (
    <Animated.Image
      source={route.params.image}
      style={[styles.screen]}
      sharedTransitionTag={String(tag)}
    />
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const SwipeDown: AnimatedScreenTransition = {
  topScreenFrame: (event, screenSize) => {
    'worklet';
    const x = Math.abs(event.translationY / screenSize.height);
    const h = screenSize.height;
    const scaleY = (((98 - h) / 0.75) * x + h) / h;
    const scaleY2 =
      ((0 - 0.115) / (1 - 0.75)) * x + (0.115 * 1 - 0 * 0.75) / (1 - 0.75);
    return {
      transform: [
        { translateY: (h / 2) * x },
        {
          scaleY: x < 0.75 ? scaleY : scaleY2,
        },
        { scaleX: 1 - x },
      ],
      borderRadius: 250 * x - 250 * x * x,
      overflow: 'hidden',
    };
  },
  belowTopScreenFrame: (event, screenSize) => {
    'worklet';
    const x = Math.abs(event.translationY / screenSize.height);
    return {
      transform: [{ scale: 0.2 * x + 0.8 }],
      borderRadius: 20,
      overflow: 'hidden',
    };
  },
};

const App = (): JSX.Element => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <GestureDetectorProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            stackAnimation: 'fade', // just not default, the transition animation is handled by SETs anyway
            statusBarStyle: 'light',
            transitionDuration: 200,
            contentStyle: { backgroundColor: 'transparent' },
          }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen
            name="Story"
            component={StoryScreen}
            options={{
              transitionAnimation: SwipeDown,
              goBackGesture: 'swipeDown',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureDetectorProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    justifyContent: 'center',
    borderRadius: 20,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 28,
    marginHorizontal: 10,
    color: '#EEF0FF',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 10,
    color: '#001A72',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  border: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#6FCEF5',
    backgroundColor: '#000',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 26,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 10,
    color: '#EEF0FF',
  },
  location: {
    fontSize: 14,
    marginHorizontal: 10,
    color: '#6FCEF5',
  },
  userRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  userAvatar: {
    height: 36,
    width: 36,
    borderRadius: 25,
  },
});

export default App;
