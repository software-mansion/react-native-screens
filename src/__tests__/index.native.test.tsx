import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Screen, ScreenContainer } from 'react-native-screens';

test('screen renders content', () => {
  const text = 'Hello, world!';
  const screen = render(
    <ScreenContainer>
      <Screen>
        <Text>{text}</Text>
      </Screen>
    </ScreenContainer>
  );
  const textEl = screen.queryByText(text);
  expect(textEl).toHaveTextContent(text);
});
