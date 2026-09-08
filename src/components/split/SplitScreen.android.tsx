const NOOP = () => {
  console.warn(
    '[RNScreens] Split component is supported only for iOS. Consider using an alternative layout for Android.',
  );
  return null;
};

const Column = NOOP;
const Inspector = NOOP;

export default { Column, Inspector };
