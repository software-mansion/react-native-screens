import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { Screen, ScreenStack, ScreenStackHeaderConfig } from '../../../../src';
import { useState } from 'react';
import Colors from '../../shared/styling/Colors';

function HomeScreen({ add }: { add: () => void }) {
  console.log('Render home');
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.RedLight40,
      }}>
      <Text>Home!</Text>
      <Button
        title="Next"
        onPress={add}
      />
    </View>
  );
}

function ProfileScreen({ add, idx }: { add: () => void, idx: number }) {
  const colors = [Colors.BlueLight40, Colors.GreenLight40, Colors.YellowLight40];
  const [colorIndex, setColorIndex] = useState(0);
  console.log('Render another');
  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors[colorIndex]
      }}>
      <Text>Another! #{idx}</Text>
      <Button
        title="More"
        onPress={add}
      />
      <Button
        title="Recolor"
        onPress={() => setColorIndex(i => (i+1) % 3)}
      />
    </View>
  );
}

const App = () => {
  const [count, setCount] = React.useState(0);

  return (
    <ScreenStack style={{ flex: 1 }}>
      <Screen key='home' activityState={2} isNativeStack onAppear={() => {setCount(0)}}>
        <ScreenStackHeaderConfig title='Home'/>
        <HomeScreen add={() => setCount(n => n+1)}/>
      </Screen>
      { Array.from({length: count}).map((_, i) => (
        <Screen key={`prof${i}`} activityState={2} isNativeStack>
          <ScreenStackHeaderConfig title={'Another #' + (i+1)}/>
          <ProfileScreen add={() => setCount(n => n+1)} idx={i+1}/>
        </Screen>
      )) }
    </ScreenStack>
  );
};
export default App;
