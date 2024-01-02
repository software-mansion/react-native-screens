import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ModalView = () => {
  useEffect(() => {
    console.log('ModalView mounted');
  }, []);

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>
        This is the outer modal. If you try to open it from the inner modal, it
        doesn't work. But if you comment out the `presentation: modal` on the
        inner modal, it does work! In addition, if opening a modal in the same
        navigator stack also works.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('modal-2')}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Open sibling outer modal.</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Back</Text>
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
    backgroundColor: 'green',
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

export default ModalView;
