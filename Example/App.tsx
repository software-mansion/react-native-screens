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
  'https://scontent.cdninstagram.com/v/t51.2885-15/347171734_918144379462147_4789619291137099835_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=scontent.cdninstagram.com&_nc_cat=107&_nc_ohc=q_V632i8a_MAX8D3OlT&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfAK0Ojqeps4N5SxhyzLJXyu_ras0ADVTfMTrxAfeE4t6A&oe=65D823AA&_nc_sid=10d13b',
  'https://scontent.cdninstagram.com/v/t51.2885-15/347653531_565898079061054_4453455050671626230_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=scontent.cdninstagram.com&_nc_cat=110&_nc_ohc=4PwXdHJV6XkAX9zR2Iy&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfB66CRFGl6f3xPhtyCpC8w9aulm_ccVE_leBNKolUv9FA&oe=65D77A44&_nc_sid=10d13b',
  'https://scontent.cdninstagram.com/v/t51.2885-15/347386909_1376382106542363_1303661864773169836_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=scontent.cdninstagram.com&_nc_cat=103&_nc_ohc=W6uRXErEga8AX9bMb1D&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfA3eRlGEp07oa1qc2zi43XeeutVDDBMQ-bONQ_tKkU-gg&oe=65D83958&_nc_sid=10d13b',
  'https://scontent.cdninstagram.com/v/t51.2885-15/347191289_242729281685637_1045169335033276859_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=scontent.cdninstagram.com&_nc_cat=109&_nc_ohc=08KKZPZeHc8AX9pmawb&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfAhQz0tWIqjj81KYw8n32BPfUJbvvQoJ0BUZvfceSQSWw&oe=65D896C2&_nc_sid=10d13b',
];

const posts = [
  'https://scontent.cdninstagram.com/v/t51.2885-15/347274903_621545773230724_2716363464525756446_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=scontent.cdninstagram.com&_nc_cat=104&_nc_ohc=YWco19mOqgwAX-Z87xF&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfCoYIQ0KAPFNt9IaVmfQYIXCHN4Mx_QbISrWN3VmE0YJw&oe=65D7A5ED&_nc_sid=10d13b',
  'https://scontent.cdninstagram.com/v/t51.2885-15/347274262_259757039945611_8707106244299845260_n.jpg?stp=dst-jpg_e15_fr_s1080x1080&_nc_ht=scontent.cdninstagram.com&_nc_cat=107&_nc_ohc=5Sz0iixExHAAX_-DZzz&edm=APs17CUBAAAA&ccb=7-5&oh=00_AfA7s9OoxQ2hQQim0g2eTy2uUveadJXlinklh1QzidJM0Q&oe=65D8BE71&_nc_sid=10d13b',
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
                  source={{
                    uri: image,
                  }}
                  sharedTransitionTag={image}></Animated.Image>
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
        source={{
          uri: 'https://scontent-waw1-1.cdninstagram.com/v/t51.2885-19/90741695_2404792386287654_4989854663319748608_n.jpg?stp=dst-jpg_s100x100&_nc_cat=106&ccb=1-7&_nc_sid=3fd06f&_nc_ohc=xJxo5CjffpYAX_wZKeJ&_nc_oc=AQlND1yOs9XepQbfKk1VLPjFyC07dpvE8n-sGs_onEe9A8LbDfktshen8IcreAFt7R8&_nc_ht=scontent-waw1-1.cdninstagram.com&oh=00_AfBHHYmVPeKlayOwF16AvI-xDUuoapDLlX6WAQXr4JRMWA&oe=65D80EF4',
        }}
        style={{ height: 36, width: 36, borderRadius: 25 }}
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
        source={{
          uri: image,
        }}
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
      source={{
        uri: route.params.image,
      }}
      style={[styles.screen]}
      sharedTransitionTag={tag}
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
});

export default App;
