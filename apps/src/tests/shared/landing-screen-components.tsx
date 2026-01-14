import React from 'react';
import { useNavigation, useTheme } from "@react-navigation/native";
import Colors from "../../shared/styling/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function TestScenarioListItem(props: { title: string; route: string, testID: string, disabled?: boolean }) {
  const navigation = useNavigation<any>();
  const theme = useTheme();

  return (
    <TouchableOpacity 
      activeOpacity={0.6} 
      style={theme.dark ? styles.listItemDark : styles.listItem}
      testID={props.testID}
      onPress={() => navigation.navigate(props.route)}
      disabled={!!props.disabled}
    >
      <Text style={theme.dark ? styles.textDark : styles.text}>{props.title}</Text>
      <Text style={theme.dark ? styles.textDark : styles.text}>→</Text>
    </TouchableOpacity>
  )
}

export function TestScenarioGroup(props: { children: React.ReactNode[] }) {
  const theme = useTheme();

  return (
    <View style={theme.dark ? styles.groupDark : styles.group}>
      {props.children}
    </View>
  )
}

export function TestScenarioSettingsSwitch(props: {
  label: string,
  value: boolean,
  onValueChange: (value: boolean) => void,
  testID: string,
}) {
  const {label, value, onValueChange, testID} = props;
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      testID={testID}
      style={theme.dark ? styles.settingsSwitchDark : styles.settingsSwitch}
    >
        <Text style={theme.dark ? styles.textDark : styles.text}>{`${label}: ${value}`}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  group: {
    flex: 1,
    gap: 20,
    padding: 20,
    marginVertical: 20,
    backgroundColor: Colors.GreenDark60,
  },
  groupDark: {
    flex: 1,
    gap: 20,
    padding: 20,
    marginVertical: 20,
    backgroundColor: Colors.NavyDark140,
  },
  settingsSwitch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.GreenDark60,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Colors.NavyDark100,
  },
  settingsSwitchDark: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.NavyDark140,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Colors.GreenDark60,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.GreenDark60,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Colors.NavyDark100,
  },
  listItemDark: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: Colors.NavyDark140,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Colors.GreenDark60,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.NavyDark100,
  },
  textDark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.GreenDark60,
  },
});