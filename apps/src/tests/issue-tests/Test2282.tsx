import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ViewProps,
  Image,
  FlatListProps,
  findNodeHandle,
} from 'react-native';

enableScreens(true);

function Item({ children, ...props }: ViewProps) {
  return (
    <View style={styles.item} {...props}>
      <Image source={require('../../../assets/trees.jpg')} style={styles.image} />
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

function Home({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Button title="Go to List" onPress={() => navigation.navigate('List')} />
    </View>
  );
}

function ListScreen() {
  return (
    <View
      style={{ flex: 1, backgroundColor: 'slateblue' }}
      removeClippedSubviews>
      <ParentFlatlist />
      <View removeClippedSubviews>
        <View style={{ backgroundColor: 'pink', width: '100%', height: 50 }} />
      </View>
      <ParentFlatlist horizontal />
    </View>
  );
}

function ListScreenSimplified({
  secondVisible,
}: {
  secondVisible?: (visible: boolean) => void;
}) {
  const containerRef = React.useRef<View>(null);
  const innerViewRef = React.useRef<View>(null);
  const childViewRef = React.useRef<View>(null);

  React.useEffect(() => {
    if (containerRef.current != null) {
      const tag = findNodeHandle(containerRef.current);
      console.log(`Container has tag [${tag}]`);
    }
    if (innerViewRef.current != null) {
      const tag = findNodeHandle(innerViewRef.current);
      console.log(`InnerView has tag [${tag}]`);
    }
    if (childViewRef.current != null) {
      const tag = findNodeHandle(childViewRef.current);
      console.log(`ChildView has tag [${tag}]`);
    }
  }, [containerRef.current, innerViewRef.current, childViewRef.current]);

  return (
    <View
      ref={containerRef}
      style={{ flex: 1, backgroundColor: 'slateblue', overflow: 'hidden' }}
      removeClippedSubviews={false}>
      <View ref={innerViewRef} removeClippedSubviews style={{ height: '100%' }}>
        <View
          ref={childViewRef}
          style={{ backgroundColor: 'pink', width: '100%', height: 50 }}
          removeClippedSubviews={false}>
          {secondVisible && (
            <Button title="Hide second" onPress={() => secondVisible(false)} />
          )}
        </View>
      </View>
    </View>
  );
}

function ParentFlatlist(props: Partial<FlatListProps<number>>) {
  return (
    <FlatList
      data={Array.from({ length: 30 }).fill(0) as number[]}
      renderItem={({ index }) => {
        if (index === 10) {
          return <NestedFlatlist key={index} />;
        } else if (index === 15) {
          return <ExtraNestedFlatlist key={index} />;
        } else if (index === 20) {
          return <NestedFlatlist key={index} horizontal />;
        } else if (index === 25) {
          return <ExtraNestedFlatlist key={index} horizontal />;
        } else {
          return <Item key={index}>List item {index + 1}</Item>;
        }
      }}
      {...props}
    />
  );
}

function NestedFlatlist(props: Partial<FlatListProps<number>>) {
  return (
    <FlatList
      style={[styles.nestedList, props.style]}
      data={Array.from({ length: 10 }).fill(0) as number[]}
      renderItem={({ index }) => (
        <Item key={'nested' + index}>Nested list item {index + 1}</Item>
      )}
      {...props}
    />
  );
}

function ExtraNestedFlatlist(props: Partial<FlatListProps<number>>) {
  return (
    <FlatList
      style={styles.nestedList}
      data={Array.from({ length: 10 }).fill(0) as number[]}
      renderItem={({ index }) =>
        index === 4 ? (
          <NestedFlatlist key={index} style={{ backgroundColor: '#d24729' }} />
        ) : (
          <Item key={'nested' + index}>Nested list item {index + 1}</Item>
        )
      }
      {...props}
    />
  );
}

const Stack = createNativeStackNavigator();

/**
 * You can use either the App component with `ListScreen` or `ListScreenSimplified`,
 * of `AppSimple` component which has little to no navigation and attempts to reproduce the issue
 */

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="List" component={ListScreenSimplified} />{' '}
        {/* <- Exchange here for ListScreen for more complex case */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function AppSimple(): React.JSX.Element {
  const [secondVisible, setSecondVisible] = React.useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: 'lightsalmon' }}>
      {!secondVisible && (
        <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
          <Button title="Show second" onPress={() => setSecondVisible(true)} />
        </View>
      )}
      {secondVisible && (
        <ListScreenSimplified secondVisible={setSecondVisible} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nestedList: {
    backgroundColor: '#FFA07A',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    width: 50,
    height: 50,
  },
});
