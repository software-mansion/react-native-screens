import React from 'react';
import { Text, StyleSheet, Dimensions, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useThemeColorPalette } from './styling/theme/useThemeColorPalette';

export const Alert = (): React.JSX.Element => {
  const navigation = useNavigation();
  const { colors } = useThemeColorPalette();

  const backgrounds = [
    colors.BlueLight80,
    colors.YellowDark80,
    colors.PurpleLight80,
    colors.BlueDark80,
    colors.YellowLight80,
  ];
  const bgColor = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  return (
    <Pressable onPress={() => navigation.goBack()} style={styles.container}>
      <View style={{ ...styles.alert, backgroundColor: bgColor }}>
        <Text style={styles.text}>Oh, hi! 👋</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alert: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    width: Dimensions.get('screen').width - 40,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});
