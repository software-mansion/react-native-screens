import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5243
//
const INITIAL_LINE_COUNT = 3;

export default function Test5243() {
  const [isOpen, setIsOpen] = useState(false);
  const [grabberVisible, setGrabberVisible] = useState(true);
  const [lineCount, setLineCount] = useState(INITIAL_LINE_COUNT);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        testID="test-5243-open"
        title="Open sheet"
        onPress={() => setIsOpen(true)}
      />
      <FormSheet
        isOpen={isOpen}
        detents="fitToContents"
        prefersGrabberVisible={grabberVisible}
        onNativeDismiss={() => setIsOpen(false)}>
        <View
          style={{
            padding: 24,
            gap: 8,
            backgroundColor: Colors.YellowLight40,
          }}>
          <Button
            testID="test-5243-toggle-grabber"
            title={`Grabber: ${grabberVisible ? 'visible' : 'hidden'}`}
            onPress={() => setGrabberVisible(v => !v)}
          />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              testID="test-5243-remove-lines"
              title="-5 lines"
              onPress={() =>
                setLineCount(c => Math.max(INITIAL_LINE_COUNT, c - 5))
              }
            />
            <Button
              testID="test-5243-add-line"
              title="+1 line"
              onPress={() => setLineCount(c => c + 1)}
            />
            <Button
              testID="test-5243-add-lines"
              title="+5 lines"
              onPress={() => setLineCount(c => c + 5)}
            />
          </View>
          {Array.from({ length: lineCount }, (_, i) => (
            <Text key={i}>Line {i + 1}</Text>
          ))}
        </View>
      </FormSheet>
    </View>
  );
}
