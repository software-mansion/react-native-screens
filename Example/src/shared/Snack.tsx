import React, {useEffect} from 'react';
import {Text, StyleSheet, Dimensions, View, Pressable} from 'react-native';
import {NavigatorScreenParams, ParamListBase} from '@react-navigation/native';
import {NativeStackNavigationProp} from 'react-native-screens/native-stack';

const DISAPPEAR_AFTER = 2000; // ms

interface Props {
  route: NavigatorScreenParams<{
    params: {backgroundColor: string; message: string};
  }>;
  navigation: NativeStackNavigationProp<ParamListBase>;
}

export const Snack = ({route, navigation}: Props): JSX.Element => {
  const {backgroundColor, message} = route.params ?? {
    backgroundColor: 'white',
    message: 'Hi!',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.goBack();
    }, DISAPPEAR_AFTER);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable style={styles.container} onPress={() => navigation.goBack()}>
      <View style={{...styles.alert, backgroundColor}}>
        <Text style={styles.text}>{message}</Text>
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
    height: 60,
    width: Dimensions.get('screen').width - 40,
    borderRadius: 10,
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
