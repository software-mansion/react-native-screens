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
  const textEl = screen.getByText(text);
  expect(textEl.props.children).toBe(text);
});
