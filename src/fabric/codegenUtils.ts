// copied from https://github.com/software-mansion/react-native-svg/blob/be06e84ec4809a8071f18f9824ffbe61424ee80d/src/fabric/codegenUtils.ts

// codegen will generate folly::dynamic in place of this type, but it's not exported by RN
// since codegen doesn't really follow imports, this way we can trick it into generating the correct type
// while keeping typescript happy
export type UnsafeMixed<T> = T;
