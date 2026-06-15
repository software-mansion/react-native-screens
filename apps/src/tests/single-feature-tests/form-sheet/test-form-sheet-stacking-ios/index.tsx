import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';
import { Colors } from '@apps/shared/styling';

export function App() {
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);
  const [isThirdOpen, setIsThirdOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stacking FormSheets Test</Text>
      <Button
        title="Open First FormSheet"
        color={Colors.primary}
        onPress={() => setIsFirstOpen(true)}
      />
      <FormSheet
        isOpen={isFirstOpen}
        onNativeDismiss={() => setIsFirstOpen(false)}
        detents={[0.4, 1.0]}>
        <View
          style={[styles.sheetContent, { backgroundColor: Colors.BlueDark40 }]}>
          <Text style={styles.sheetTitle}>First FormSheet</Text>
          <View style={styles.spacing} />

          <Button
            title="Open Second FormSheet"
            color={Colors.primary}
            onPress={() => setIsSecondOpen(true)}
          />
          <View style={styles.spacing} />
          <Button
            title="Dismiss First FormSheet"
            color={Colors.primary}
            onPress={() => setIsFirstOpen(false)}
          />
        </View>
      </FormSheet>
      <FormSheet
        isOpen={isSecondOpen}
        onNativeDismiss={() => setIsSecondOpen(false)}
        detents={[0.4, 1.0]}>
        <View
          style={[
            styles.sheetContent,
            { backgroundColor: Colors.GreenDark40 },
          ]}>
          <Text style={styles.sheetTitle}>Second FormSheet</Text>
          <Button
            title="Open Third FormSheet"
            color={Colors.primary}
            onPress={() => setIsThirdOpen(true)}
          />
          <View style={styles.spacing} />
          <Button
            title="Dismiss First FormSheet"
            color={Colors.primary}
            onPress={() => setIsFirstOpen(false)}
          />
          <View style={styles.spacing} />
          <Button
            title="Dismiss Second FormSheet"
            color={Colors.primary}
            onPress={() => setIsSecondOpen(false)}
          />
        </View>
      </FormSheet>
      <FormSheet
        isOpen={isThirdOpen}
        onNativeDismiss={() => setIsThirdOpen(false)}
        detents={[0.4, 1.0]}>
        <View
          style={[
            styles.sheetContent,
            { backgroundColor: Colors.YellowDark40 },
          ]}>
          <Text style={styles.sheetTitle}>Third FormSheet</Text>
          <View style={styles.spacing} />
          <Button
            title="Dismiss First FormSheet"
            color={Colors.primary}
            onPress={() => setIsFirstOpen(false)}
          />
          <View style={styles.spacing} />
          <Button
            title="Dismiss Second FormSheet"
            color={Colors.primary}
            onPress={() => setIsSecondOpen(false)}
          />
          <View style={styles.spacing} />
          <Button
            title="Dismiss Third FormSheet"
            color={Colors.primary}
            onPress={() => setIsThirdOpen(false)}
          />
        </View>
      </FormSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.offBackground,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  sheetContent: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.text,
  },
  spacing: {
    height: 24,
  },
});

export default createScenario(App, scenarioDescription);
