import {NavigationAction, NavigationContainer, useIsFocused, usePreventRemove} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React, {useCallback, useState} from "react";
import {Button, Modal, StyleSheet, Text, View} from "react-native";

const Stack = createNativeStackNavigator();


function TestModal({ navigation }): React.JSX.Element | null {
    const [pendingAction, setPendingAction] = useState<NavigationAction>();
    const handlePressCancel = useCallback(() => {
        setPendingAction(undefined);
    }, []);
    const isFocused = useIsFocused();
    const handlePressConfirm = useCallback(
        (action: NavigationAction) => {
            setPendingAction(undefined);
            navigation.dispatch(action);
        },
        [navigation],
    );
    usePreventRemove(isFocused && !pendingAction, event => {
        setPendingAction(event.data.action);
    });

    if (!pendingAction) {
        return null;
    }

    return (
        <Modal
            animationType="none"
            hardwareAccelerated
            transparent
            visible
            onRequestClose={handlePressCancel}>
            <View style={styles.screen}>
                <View>
                    <View style={styles.dialog}>
                        <View>
                            <Button title={"Go back"} onPress={() => handlePressConfirm(pendingAction)}>
                            </Button>
                            <Button title={"Cancel"} onPress={handlePressCancel}>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const SecondScreen = ({ navigation }): React.JSX.Element => {
    return ( <>
            <TestModal navigation={navigation} />
            <Text>This is second</Text>
        </>
    )
}

function HomeScreen({ navigation }): React.JSX.Element {
    const [toggle, setToggle] = React.useState(false);
    return (
        <View style={{ flex: 1, backgroundColor: 'lightred', justifyContent: 'center', }}>
            <Button title={'Go To Second Screen'} onPress={() => { navigation.navigate('SecondScreen')}} />
        </View>
    )
}


function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                />
                <Stack.Screen
                    name={"SecondScreen"}
                    component={SecondScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dialog: {
        backgroundColor: 'white',
        padding: 25,
        elevation: 2,
        width: '100%',
        maxHeight: '100%',
    },
});

export default App;
