import warnOnce from 'warn-once';

export const ContainedModalOverContext = () => {
  warnOnce(
    true,
    '[RNScreens] As of now, ContainedModalOverContext component is supported only for iOS.',
  );
  return null;
};
