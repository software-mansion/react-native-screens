import warnOnce from 'warn-once';

export const PageSheet = () => {
  warnOnce(
    true,
    '[RNScreens] As of now, PageSheet component is not supported for web.',
  );
  return null;
};
