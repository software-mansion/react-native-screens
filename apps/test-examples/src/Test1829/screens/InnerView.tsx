import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeView = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>
        This is the inner navigator. Opening the outer modal here works!
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('inner-modal')}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Open Inner Modal</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('modal')}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Open Outer Modal</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Go back</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  button: {
    width: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
  },
});

export default HomeView;
