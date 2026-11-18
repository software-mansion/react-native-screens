import warnOnce from 'warn-once';

export const FullScreenModalOverContent = () => {
  warnOnce(
    true,
    '[RNScreens] As of now, FullScreenModalOverContent component is supported only for iOS.',
  );
  return null;
};
