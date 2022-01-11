import React, {useState} from 'react';
import ScreenContent from './ScreenContent';
import {ScreenStack} from 'react-native-screens/fabric';

function App() {
  const [screens, setScreens] = useState([Date.now()]);
  const addScreen = () => setScreens(prev => [...prev, Date.now()]);
  const removeScreen = () => setScreens(prev => prev.slice(0, -1));
  return (
    <ScreenStack style={{flex: 1}}>
      {screens.map((key, i) => (
        <ScreenContent
          key={key}
          index={i}
          pushScreen={addScreen}
          popScreen={removeScreen}
        />
      ))}
    </ScreenStack>
  );
}

export default App;
