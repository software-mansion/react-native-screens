#pragma once

#if defined(__cplusplus)

namespace rnscreens {

namespace do_not_use {

/// This is a marker type, that should never be instantiated.
/// It is here to assert that there is a valid template specialization for
/// `always_false` that can return `true`. Check out this article:
/// https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2022/p2593r0.html#valid-workaround
struct DoNotUseThis {
  DoNotUseThis() = delete;
  DoNotUseThis(const DoNotUseThis &other) = delete;
  DoNotUseThis(const DoNotUseThis &&other) = delete;
};

}; // namespace do_not_use

/// Workaround for  `static_assert(false)`. See:
/// https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2022/p2593r0.html#valid-workaround
/// https://stackoverflow.com/questions/14637356/static-assert-fails-compilation-even-though-template-function-is-called-nowhere/14637534#14637534
template <typename T>
struct always_false : std::false_type {};
template <>
struct always_false<do_not_use::DoNotUseThis> : std::true_type {};

}; // namespace rnscreens

#endif // defined(__cplusplus)
