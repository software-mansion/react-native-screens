import warnOnce from 'warn-once';

export const ContainedModalOverContent = () => {
  warnOnce(
    true,
    '[RNScreens] As of now, ContainedModalOverContent component is supported only for iOS.',
  );
  return null;
};
