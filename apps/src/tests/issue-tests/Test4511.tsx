import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';

export default function App() {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [cycles, setCycles] = useState(0);

  const closeParent = () => {
    setChildOpen(false);
    setParentOpen(false);
    setCycles(current => current + 1);
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>FullWindowOverlay recycling test</Text>
      <Text>Completed cycles: {cycles}</Text>
      <Pressable
        onPress={() => setParentOpen(true)}
        style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Open parent overlay</Text>
      </Pressable>

      {parentOpen && (
        <FullWindowOverlay>
          <View style={styles.parentBackdrop}>
            <View style={styles.parentCard}>
              <Text style={styles.title}>Parent overlay</Text>
              <Pressable
                onPress={() => setChildOpen(true)}
                style={styles.button}>
                <Text>Open child overlay</Text>
              </Pressable>
              <Pressable onPress={closeParent} style={styles.button}>
                <Text>Close parent overlay</Text>
              </Pressable>
            </View>
          </View>
        </FullWindowOverlay>
      )}

      {childOpen && (
        <FullWindowOverlay>
          <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <View style={styles.childCard}>
              <Text style={styles.childTitle}>Child overlay</Text>
              <Pressable
                onPress={() => setChildOpen(false)}
                style={styles.button}>
                <Text>Close child overlay</Text>
              </Pressable>
            </View>
          </View>
        </FullWindowOverlay>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  parentBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  parentCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    gap: 12,
    padding: 24,
    width: '100%',
  },
  button: {
    backgroundColor: 'white',
    borderColor: '#d4d4d4',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  childCard: {
    alignSelf: 'center',
    backgroundColor: '#f97316',
    borderRadius: 20,
    gap: 12,
    marginTop: 540,
    padding: 20,
    width: 260,
  },
  childTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
