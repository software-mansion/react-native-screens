import Colors from '../../../../shared/styling/Colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function RegularView() {
  return (
    <View style={styles.container}>
      <View style={styles.containerHorizontal}>
        <Text style={[styles.text]}>TOP</Text>
      </View>
      <View style={styles.containerVertical}>
        <Text style={[styles.text]}>LEFT</Text>
        <Text style={[styles.text]}>RIGHT</Text>
      </View>
      <View style={styles.containerHorizontal}>
        <Text style={[styles.text]}>BOTTOM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: Colors.PurpleLight80,
  },
  text: {
    color: Colors.PurpleDark120,
    fontSize: 18,
    fontWeight: 'bold',
  },
  containerHorizontal: {
    flex: 0,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  containerVertical: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
