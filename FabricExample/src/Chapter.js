import React from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {PRIMARY, WHITE} from './colors';

export default function Chapter({navigation, route}) {
  const {index, chapters, chapterRoute, afterChapterRoute} = route.params;
  const isLast = index === chapters.length - 1;
  const nextRoute = isLast ? afterChapterRoute : chapterRoute;
  const nextParams = isLast ? {} : {index: index + 1};
  const goToNext = () => navigation.push(nextRoute, nextParams);
  const currentChapter = chapters[index];
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.title}>{currentChapter.title}</Text>
      <Text style={styles.content}>{currentChapter.content}</Text>
      <Button onPress={goToNext} title="Next >" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingHorizontal: 14,
    backgroundColor: WHITE,
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    color: PRIMARY,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    color: PRIMARY,
    fontSize: 18,
    marginBottom: 14,
  },
});
