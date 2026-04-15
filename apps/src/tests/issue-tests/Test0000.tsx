import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { SettingsSwitch } from '@apps/shared';
import { ScrollView } from 'react-native';

const Stack = createNativeStackNavigator();

const COLORS = ['default', '#FF0000', '#00AA00', '#0000FF', '#FF9900'];

type ColorRadioProps = {
  label: string;
  selected: string;
  onSelect: (color: string) => void;
};

function ColorRadio({ label, selected, onSelect }: ColorRadioProps) {
  return (
    <View style={styles.radioGroup}>
      <Text style={styles.radioLabel}>{label}</Text>
      <View style={styles.radioRow}>
        {COLORS.map(color => (
          <TouchableOpacity
            key={color}
            onPress={() => onSelect(color)}
            style={[
              styles.radioItem,
              selected === color && styles.radioItemSelected,
            ]}>
            {color === 'default' ? (
              <Text style={styles.radioText}>default</Text>
            ) : (
              <View style={[styles.colorSwatch, { backgroundColor: color }]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function HomeScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [largeHeader, setLargeHeader] = React.useState(true);
  const [backgroundColor, setBackgroundColor] = React.useState('default');
  const [largeHeaderBackgroundColor, setLargeHeaderBackgroundColor] =
    React.useState('default');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Large Title Test',
      headerLargeTitle: largeHeader,
      headerStyle:
        backgroundColor === 'default' ? undefined : { backgroundColor },
      headerLargeStyle:
        largeHeaderBackgroundColor === 'default'
          ? undefined
          : { backgroundColor: largeHeaderBackgroundColor },
    });
  }, [navigation, largeHeader, backgroundColor, largeHeaderBackgroundColor]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <SettingsSwitch
          label="largeHeader"
          value={largeHeader}
          onValueChange={setLargeHeader}
        />
        <ColorRadio
          label="backgroundColor"
          selected={backgroundColor}
          onSelect={setBackgroundColor}
        />
        <ColorRadio
          label="largeHeaderBackgroundColor"
          selected={largeHeaderBackgroundColor}
          onSelect={setLargeHeaderBackgroundColor}
        />
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  radioGroup: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  radioLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioItem: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioItemSelected: {
    borderColor: '#000',
    borderWidth: 2,
    backgroundColor: '#eee',
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  radioText: {
    fontSize: 12,
  },
});
