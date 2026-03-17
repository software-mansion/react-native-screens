import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  requireNativeComponent,
  Platform,
} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button } from '../shared';

// Native SharedTransitionView - wraps the Android native view
const SharedTransitionView =
  Platform.OS === 'android'
    ? requireNativeComponent<any>('RNSSharedTransitionView')
    : View;

type StackParamList = {
  List: undefined;
  Detail: { color: string; title: string; emoji: string };
};

const ITEMS = [
  { id: '1', color: '#FF6B6B', title: 'Sunset Red', emoji: '🌅' },
  { id: '2', color: '#4ECDC4', title: 'Ocean Teal', emoji: '🌊' },
  { id: '3', color: '#45B7D1', title: 'Sky Blue', emoji: '☁️' },
  { id: '4', color: '#96CEB4', title: 'Mint Green', emoji: '🌿' },
  { id: '5', color: '#FFEAA7', title: 'Sunny Yellow', emoji: '☀️' },
  { id: '6', color: '#DDA0DD', title: 'Plum Purple', emoji: '🍇' },
];

interface ListScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'List'>;
}

const ListScreen = ({ navigation }: ListScreenProps): React.JSX.Element => {
  const handlePress = useCallback(
    (item: (typeof ITEMS)[0]) => {
      navigation.navigate('Detail', {
        color: item.color,
        title: item.title,
        emoji: item.emoji,
      });
    },
    [navigation],
  );

  return (
    <View style={styles.listContainer}>
      <Text style={styles.heading}>Shared Element Transition Demo</Text>
      <Text style={styles.subtitle}>
        Tap a card to see it expand into the detail screen
      </Text>
      <View style={styles.grid}>
        {ITEMS.map(item => (
          <Pressable
            key={item.id}
            onPress={() => handlePress(item)}
            style={styles.cardPressable}>
            <View style={styles.cardWrapper}>
              <SharedTransitionView
                sharedTransitionTag={`card-${item.id}`}
                style={[styles.cardBackground, { backgroundColor: item.color }]}
              />
              <View style={styles.cardContent} pointerEvents="none">
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </View>
  );
};

interface DetailScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Detail'>;
  route: { params: { color: string; title: string; emoji: string } };
}

const DetailScreen = ({
  navigation,
  route,
}: DetailScreenProps): React.JSX.Element => {
  const { color, title, emoji } = route.params;

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeroWrapper}>
        <SharedTransitionView
          sharedTransitionTag={`card-${ITEMS.find(i => i.color === color)?.id}`}
          style={[styles.detailHeroBackground, { backgroundColor: color }]}
        />
        <View style={styles.detailHeroContent} pointerEvents="none">
          <Text style={styles.detailEmoji}>{emoji}</Text>
          <Text style={styles.detailTitle}>{title}</Text>
        </View>
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailDescription}>
          This screen was reached via a shared element transition. The colored
          card from the list animated and expanded to become the hero section of
          this detail screen.
        </Text>
        <Text style={styles.detailDescription}>
          On Android, this uses the native Fragment shared element transition
          API with ChangeBounds, ChangeTransform, ChangeClipBounds, and Fade
          transitions.
        </Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const SharedTransition = (): React.JSX.Element => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="List"
        component={ListScreen}
        options={{ title: 'Shared Transition' }}
      />
      <Stack.Screen
        name="Detail"
        options={{
          headerShown: false,
          animation: 'fade',
        }}>
        {(props: any) => <DetailScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardPressable: {
    width: '48%',
    marginBottom: 12,
  },
  cardWrapper: {
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  detailHeroWrapper: {
    height: 300,
  },
  detailHeroBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  detailHeroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  detailContent: {
    padding: 24,
  },
  detailDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 16,
  },
});

export default SharedTransition;
