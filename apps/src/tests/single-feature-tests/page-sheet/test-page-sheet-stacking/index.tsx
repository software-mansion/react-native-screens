import React, { useState } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { FormSheet, PageSheet } from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';
import { Colors } from '@apps/shared/styling';

function TestPageSheetStacking() {
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);
  const [isThirdOpen, setIsThirdOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mixed Stacking Test</Text>
      <Button
        title="Open First PageSheet"
        color={Colors.primary}
        onPress={() => setIsFirstOpen(true)}
      />
      <PageSheet
        isOpen={isFirstOpen}
        onNativeDismiss={() => setIsFirstOpen(false)}
        detents={[0.4, 1.0]}>
        <View
          style={[styles.sheetContent, { backgroundColor: Colors.BlueDark40 }]}>
          <Text style={styles.sheetTitle}>First PageSheet</Text>
          <View style={styles.spacing} />
          <Button
            title="Open Second FormSheet"
            color={Colors.primary}
            onPress={() => setIsSecondOpen(true)}
          />
          <View style={styles.spacing} />
          <Button
            title="Dismiss First PageSheet"
            color={Colors.primary}
            onPress={() => setIsFirstOpen(false)}
          />
        </View>
      </PageSheet>
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
            title="Open Third PageSheet"
            color={Colors.primary}
            onPress={() => setIsThirdOpen(true)}
          />
          <View style={styles.spacing} />
          <Button
            title="Dismiss First PageSheet"
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
      <PageSheet
        isOpen={isThirdOpen}
        onNativeDismiss={() => setIsThirdOpen(false)}
        detents={[0.4, 1.0]}>
        <View
          style={[
            styles.sheetContent,
            { backgroundColor: Colors.YellowDark40 },
          ]}>
          <Text style={styles.sheetTitle}>Third PageSheet</Text>
          <View style={styles.spacing} />
          <Button
            title="Dismiss First PageSheet"
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
            title="Dismiss Third PageSheet"
            color={Colors.primary}
            onPress={() => setIsThirdOpen(false)}
          />
        </View>
      </PageSheet>
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
    justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-start',
    backgroundColor: Colors.background,
    padding: 24,
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

export default createScenario(TestPageSheetStacking, scenarioDescription);
