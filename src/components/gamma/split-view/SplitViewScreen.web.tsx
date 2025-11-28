const NOOP = () => {
  console.warn(
    '[RNScreens] SplitView is supported only for iOS. Consider using an alternative layout for Web.',
  );
  return null;
};

const Column = NOOP;
const Inspector = NOOP;

export default { Column, Inspector };
