import React, { useState } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';

export default function App() {
  const [modalShown, setModalShown] = useState(false);
  return (
    <View style={styles.container}>
      <Button title="Show" onPress={() => setModalShown(true)} />
      <Button
        title="Show Delayed"
        onPress={() => setTimeout(() => setModalShown(true), 2000)}
      />
      <Button title="Reset" onPress={() => setModalShown(false)} />
      {modalShown && <MyModal onHide={() => setModalShown(false)} />}
      <Text>modal shown: {String(modalShown)}</Text>
    </View>
  );
}

function MyModal({ onHide }: { onHide: () => void }) {
  return (
    <FullWindowOverlay>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'red',
        }}>
        <Button title="Hide" onPress={onHide} />
      </View>
    </FullWindowOverlay>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
    alignItems: 'center',
  },
});
