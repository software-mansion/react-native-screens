import React, { useRef } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Split, SplitHostCommands } from 'react-native-screens/experimental';
import { Colors } from '../../../shared/styling/Colors';

const SplitShowColumn = () => {
  const splitRef = useRef<SplitHostCommands>(null);

  return (
    <Split.Host
      ref={splitRef}
      preferredDisplayMode="twoBesideSecondary"
      preferredSplitBehavior="tile"
      topColumnForCollapsing="primary">
      <Split.Column>
        <View style={[styles.container, { backgroundColor: Colors.White }]}>
          <Text style={styles.text}>Primary</Text>
          <View style={styles.buttons}>
            <Button
              title="Show Primary"
              onPress={() => splitRef.current?.show('primary')}
            />
            <Button
              title="Show Supplementary"
              onPress={() => splitRef.current?.show('supplementary')}
            />
            <Button
              title="Show Secondary"
              onPress={() => splitRef.current?.show('secondary')}
            />
          </View>
        </View>
      </Split.Column>
      <Split.Column>
        <View style={[styles.container, { backgroundColor: Colors.OffWhite }]}>
          <Text style={styles.text}>Supplementary</Text>
          <View style={styles.buttons}>
            <Button
              title="Show Primary"
              onPress={() => splitRef.current?.show('primary')}
            />
            <Button
              title="Show Supplementary"
              onPress={() => splitRef.current?.show('supplementary')}
            />
            <Button
              title="Show Secondary"
              onPress={() => splitRef.current?.show('secondary')}
            />
          </View>
        </View>
      </Split.Column>
      <Split.Column>
        <View
          style={[styles.container, { backgroundColor: Colors.NavyLight20 }]}>
          <Text style={styles.text}>Secondary</Text>
          <View style={styles.buttons}>
            <Button
              title="Show Primary"
              onPress={() => splitRef.current?.show('primary')}
            />
            <Button
              title="Show Supplementary"
              onPress={() => splitRef.current?.show('supplementary')}
            />
            <Button
              title="Show Secondary"
              onPress={() => splitRef.current?.show('secondary')}
            />
          </View>
        </View>
      </Split.Column>
    </Split.Host>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttons: {
    gap: 10,
  },
});

export default SplitShowColumn;
