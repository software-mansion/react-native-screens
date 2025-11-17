import React from 'react';
import { Text } from 'react-native';

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed egestas felis. Proin laoreet eros a tellus elementum, quis euismod enim gravida. Morbi at arcu commodo, condimentum purus a, congue sapien. Nunc luctus molestie enim ut mattis. Pellentesque sollicitudin, arcu nec sodales gravida, tortor mauris dignissim urna, nec venenatis nibh ex ut odio. Donec rhoncus arcu eu pulvinar cursus. Sed id ullamcorper erat. Proin mollis a mi vitae posuere. Integer a pretium tellus, vel faucibus metus. Pellentesque non lorem ullamcorper, auctor tellus vulputate, eleifend metus. Aenean in semper erat. Ut arcu elit, semper et dolor eu, pharetra ornare dui. Donec ac condimentum tellus, sed consequat tortor. Etiam facilisis diam sit amet felis rhoncus aliquet. Vestibulum pharetra sapien in tellus pharetra, vel rhoncus ipsum pharetra. Mauris eget porttitor nulla. Vestibulum blandit neque in molestie laoreet. Aliquam semper risus sit amet augue hendrerit suscipit. Vivamus eleifend aliquam congue. Mauris id volutpat neque. Donec erat justo, dictum quis ultrices sit amet, fermentum vel augue. Donec ut velit sit amet mauris tincidunt tincidunt.';

interface LongTextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  wordCount?: number;
}

export default function LongText({ size = 'md', wordCount }: LongTextProps) {
  const sizePresets = {
    xs: 100,
    sm: 250,
    md: 500,
    lg: 750,
    xl: 900,
  };

  const baseWords = lorem.split(' ');
  const desiredCount = wordCount ?? sizePresets[size];

  const repeatedWords = Array(Math.ceil(desiredCount / baseWords.length))
    .fill(baseWords)
    .flat()
    .slice(0, desiredCount);

  const text = repeatedWords.join(' ');

  return <Text>{text}</Text>;
}
