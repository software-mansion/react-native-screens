import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../shared/styling/Colors';

const Stack = createNativeStackNavigator();

export default function App() {
  const [overlayVisible, setOverlayVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Modal"
            options={{
              presentation: 'fullScreenModal',
            }}>
            {() => <ModalScreen showOverlay={() => setOverlayVisible(true)} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      {overlayVisible && (
        <FullWindowOverlay>
          <FullWindowOverlayContents
            closeOverlay={() => setOverlayVisible(false)}
          />
        </FullWindowOverlay>
      )}
    </View>
  );
}

function ModalScreen({ showOverlay }: { showOverlay: () => void }) {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: Colors.GreenLight40 }]}>
      <Text style={styles.modalText}>I am a Native Stack Modal</Text>
      <Text style={styles.modalSubText}>
        I am inside the NavigationContainer. The Overlay is outside.
      </Text>

      <View style={styles.spacer} />

      <Button
        title="Open FullWindowOverlay"
        color={Colors.RedDark100}
        onPress={showOverlay}
      />
      <Button
        title="Close modal"
        color={Colors.RedDark100}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

// 2. The Home Screen (just to open the modal)
function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Test 3321: Sibling Structure</Text>
      <Button
        title="Open Full Screen Modal"
        onPress={() => navigation.navigate('Modal')}
      />
    </View>
  );
}

function FullWindowOverlayContents(props: { closeOverlay: () => void }) {
  return (
    <View style={styles.overlayContainer}>
      <View style={styles.overlayBox}>
        <Text style={styles.overlayText}>✅ VISIBLE</Text>
        <Text style={styles.overlaySubText}>
          I am a Sibling Overlay. I successfully covered the Modal.
        </Text>
        <Button
          title="Close Overlay"
          color="white"
          onPress={() => props.closeOverlay()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    color: Colors.GreenLight100,
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalSubText: {
    color: Colors.GreenLight100,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
  },
  hint: {
    color: '#888',
    marginTop: 20,
    fontStyle: 'italic',
  },
  spacer: {
    height: 40,
  },
  // Overlay Styles
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlayBox: {
    width: '90%',
    height: 150,
    backgroundColor: Colors.PurpleLight60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  overlaySubText: {
    color: 'white',
    marginBottom: 15,
  },
});
