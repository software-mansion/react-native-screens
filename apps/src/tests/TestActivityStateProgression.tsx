import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { Screen, ScreenStack } from '../../../src';

function HomeScreen({
  setActivityState,
}: {
  setActivityState: (state: 0 | 1 | 2) => void;
}) {
  console.log('Render home');
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Home!</Text>
      <Button
        title="Set Activity State to 2"
        onPress={() => setActivityState(2)}
      />
    </View>
  );
}

function ProfileScreen({
  setActivityState,
}: {
  setActivityState: (state: 0 | 1 | 2) => void;
}) {
  console.log('Render profile');
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Profile!</Text>
      <Button
        title="Set Activity State to 0"
        onPress={() => setActivityState(0)}
      />
    </View>
  );
}

const App = () => {
  const [activityState, setActivityState] = React.useState<0 | 1 | 2>(0);
  console.log('activityState', activityState);

  /**
   * Remove isNativeStack if you want to test native checks
   */
  return (
    <ScreenStack style={{ flex: 1 }}>
      <Screen activityState={2} isNativeStack>
        <HomeScreen setActivityState={setActivityState} />
      </Screen>
      <Screen activityState={activityState} isNativeStack>
        <ProfileScreen setActivityState={setActivityState} />
      </Screen>
    </ScreenStack>
  );
};
export default App;
