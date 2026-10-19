import warnOnce from 'warn-once';

export const ContainedModalProvider = () => {
  warnOnce(
    true,
    '[RNScreens] As of now, ContainedModalProvider component is supported only for iOS.',
  );
  return null;
};
