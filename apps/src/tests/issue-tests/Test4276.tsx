import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LongText from '@apps/shared/LongText';

type RootStackParamList = {
  Home: undefined;
  ModalOpaque: undefined;
  ModalTransparent: undefined;
  ModalTransparentWithPadding: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>fitToContents & transparent header issue</Text>
      <Text style={styles.text}>
        With "sheetAllowedDetents: 'fitToContents'", the modal should adjust its
        height to fit its text.
      </Text>
      <Button
        title="Opaque Header"
        onPress={() => navigation.navigate('ModalOpaque')}
      />
      <Button
        title="Transparent Header"
        onPress={() => navigation.navigate('ModalTransparent')}
      />
      <Button
        title="Transparent Header (with padding)"
        onPress={() => navigation.navigate('ModalTransparentWithPadding')}
      />
    </View>
  );
}

function ModalContent() {
  return (
    <View>
      <LongText size="xs" />
    </View>
  );
}

function ModalContentWithPadding() {
  return (
    <View style={styles.modalContent}>
      <LongText size="xs" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home Screen' }}
        />

        <Stack.Screen
          name="ModalOpaque"
          component={ModalContent}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            headerTransparent: false,
            title: 'Opaque Header',
          }}
        />

        <Stack.Screen
          name="ModalTransparent"
          component={ModalContent}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            headerTransparent: true,
            title: 'Transparent Header',
          }}
        />

        <Stack.Screen
          name="ModalTransparentWithPadding"
          component={ModalContentWithPadding}
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
            headerTransparent: true,
            title: 'Transparent Header (with padding)',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContent: {
    paddingTop: 60,
  },
});
