import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {
  Split
} from 'react-native-screens/experimental';
import { Colors } from '../../shared/styling/Colors';
import { SplitBaseConfig } from './helpers/types';

const { width } = Dimensions.get('window');

const FlatListColumn = () => {
  const data = useMemo(
    () => Array.from({ length: 500 }, (_, i) => `Item ${i + 1}`),
    [],
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item}-${index}`}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Text style={styles.text}>{item}</Text>
        </View>
      )}
    />
  );
};

const ScrollViewColumn = () => {
  const data = useMemo(
    () => Array.from({ length: 200 }, (_, i) => `Item ${i + 1}`),
    [],
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContentContainer}>
      {data.map((item, idx) => (
        <View key={idx} style={styles.scrollItem}>
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const GridImage = ({ numColumns = 2 }: { numColumns?: number }) => {
  const images = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, index) => ({
        id: `img-${index}`,
        uri: `https://picsum.photos/seed/${index}/200`,
      })),
    [],
  );

  const imageSize = width / (numColumns * 2);

  return (
    <ScrollView
      contentContainerStyle={[styles.scrollContentContainer, styles.flexRow]}>
      {images.map((img, _) => (
        <Image
          key={img.id}
          source={{ uri: img.uri }}
          style={{ width: imageSize, height: imageSize }}
        />
      ))}
    </ScrollView>
  );
};

const SplitPerfApp = ({
  splitViewBaseConfig,
}: {
  splitViewBaseConfig: SplitBaseConfig;
}) => {
  return (
    <Split.Host {...splitViewBaseConfig}>
      <Split.Column>
        <View
          style={[styles.container, { backgroundColor: Colors.RedLight40 }]}>
          <FlatListColumn />
        </View>
      </Split.Column>
      <Split.Column>
        <View
          style={[styles.container, { backgroundColor: Colors.GreenLight60 }]}>
          <ScrollViewColumn />
        </View>
      </Split.Column>
      <Split.Column>
        <View
          style={[styles.container, { backgroundColor: Colors.NavyLight40 }]}>
          <GridImage />
        </View>
      </Split.Column>
    </Split.Host>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    height: 60,
    justifyContent: 'center',
    borderColor: Colors.White,
    borderBottomWidth: 1,
  },
  scrollContentContainer: {
    alignItems: 'center',
    margin: 16,
  },
  scrollItem: {
    height: 60,
    width: '100%',
    backgroundColor: Colors.White,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  text: {
    fontSize: 24,
  },
  flexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default SplitPerfApp;
