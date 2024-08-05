import React from 'react';
import { ScrollView, StyleSheet, View, ImageBackground } from 'react-native';
import { ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, Form, Choose, Alert, Dialog } from '../shared';

type StackParamList = {
  Main: undefined;
  Push: undefined;
  Modal: undefined;
  TransparentModal: undefined;
  ContainedModal: undefined;
  ContainedTransparentModal: undefined;
  FullScreenModal: undefined;
  FormSheet: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const MainScreen = ({ navigation }: MainScreenProps): React.JSX.Element => {
  return (
    <ScrollView
      style={{ ...styles.container, backgroundColor: 'thistle' }}
      testID="stack-presentation-root-scroll-view">
      <Button
        title="push"
        onPress={() => navigation.navigate('Push')}
        testID="stack-presentation-push-button"
      />
      <Button
        title="modal"
        onPress={() => navigation.navigate('Modal')}
        testID="stack-presentation-modal-button"
      />
      <Button
        title="transparentModal"
        onPress={() => navigation.navigate('TransparentModal')}
        testID="stack-presentation-transparent-modal-button"
      />
      <Button
        title="containedModal"
        onPress={() => navigation.navigate('ContainedModal')}
        testID="stack-presentation-contained-modal-button"
      />
      <Button
        title="containedTransparentModal"
        onPress={() => navigation.navigate('ContainedTransparentModal')}
        testID="stack-presentation-contained-transparent-modal-button"
      />
      <Button
        title="fullScreenModal"
        onPress={() => navigation.navigate('FullScreenModal')}
        testID="stack-presentation-full-screen-modal-button"
      />
      <Button
        title="formSheet"
        onPress={() => navigation.navigate('FormSheet')}
        testID="stack-presentation-form-sheet-button"
      />
      <Button
        testID="stack-presentation-go-back-button"
        onPress={() => navigation.pop()}
        title="🔙 Back to Examples"
      />
    </ScrollView>
  );
};

interface FormScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const FormScreen = ({ navigation }: FormScreenProps): React.JSX.Element => (
  <View style={styles.container}>
    <Form />
    <Button
      testID="stack-presentation-form-screen-go-back-button"
      title="Go back"
      onPress={() => navigation.goBack()}
    />
  </View>
);

interface ModalScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const ModalScreen = ({ navigation }: ModalScreenProps): React.JSX.Element => (
  <View style={styles.container}>
    <Choose />
    <Button
      testID="stack-presentation-modal-screen-go-back-button"
      title="Go back"
      onPress={() => navigation.goBack()}
    />
  </View>
);

interface FullScreenModalProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const FullScreenModalScreen = ({
  navigation,
}: FullScreenModalProps): React.JSX.Element => (
  <View style={{ flex: 1 }}>
    <ImageBackground
      style={styles.image}
      source={require('../assets/trees.jpg')}>
      <Button
        testID="stack-presentation-fullscreen-modal-go-back-button"
        title="Go back"
        onPress={() => navigation.goBack()}
      />
    </ImageBackground>
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): React.JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerBackVisible: true,
    }}>
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{ title: 'Stack Presentation' }}
    />
    <Stack.Screen
      name="Push"
      component={FormScreen}
      options={{ presentation: 'card' }}
    />
    <Stack.Screen
      name="Modal"
      component={ModalScreen}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen
      name="TransparentModal"
      component={Alert}
      options={{
        presentation: 'transparentModal',
        headerShown: false,
        animation: 'slide_from_bottom',
      }}
    />
    <Stack.Screen
      name="ContainedModal"
      component={ModalScreen}
      options={{ presentation: 'containedModal' }}
    />
    <Stack.Screen
      name="ContainedTransparentModal"
      component={Dialog}
      options={{
        presentation: 'containedTransparentModal',
        headerShown: false,
        animation: 'fade',
      }}
    />
    <Stack.Screen
      name="FullScreenModal"
      component={FullScreenModalScreen}
      options={{
        presentation: 'fullScreenModal',
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="FormSheet"
      component={FormScreen}
      options={{ presentation: 'formSheet' }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default App;
