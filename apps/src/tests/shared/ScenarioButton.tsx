import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function ScenarioButton(props: { route: string, title: string, details?: string, platformsHint?: ('ios'|'android')[] }) {
  const navigation = useNavigation<any>();
  const hasAndroid = props.platformsHint?.length === 0 || props.platformsHint?.includes('android');
  const hasIOS = props.platformsHint?.length === 0 || props.platformsHint?.includes('ios');

  return (
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(props.route)}>
      <View style={styles.descriptionContainer}>
        <Text style={styles.text}>{props.title}</Text>
        { props.details && <Text style={styles.details}>{props.details}</Text> }
      </View>
      <View style={styles.platformsContainer}>
        { hasIOS && <Text style={styles.ios}>i</Text> }
        { hasAndroid && <Text style={styles.android}>a</Text> }
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
  },
  details: {
    fontSize: 12,
  },
  button: {
    flex: 1,
    gap: 20,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  descriptionContainer: {
    flex: 1,
  },
  platformsContainer: {
    flexDirection: 'row',
  },
  ios: {
    fontSize: 18,
    padding: 4,
    fontWeight: '900',
    color: 'blue',
  },
  android: {
    fontSize: 18,
    padding: 4,
    fontWeight: '900',
    color: 'green',
  },
});