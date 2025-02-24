#pragma once

#define RNS_IGNORE_SUPER_CALL_BEGIN \
  _Pragma("clang diagnostic push")  \
      _Pragma("clang diagnostic ignored \"-Wobjc-missing-super-calls\"")

#define RNS_IGNORE_SUPER_CALL_END _Pragma("clang diagnostic pop")

// Check if the mutation has parentTag
template <typename T>
using has_parentTag_t = decltype(std::declval<T>().parentTag);
template <typename T>
inline constexpr bool has_parentTag = !std::is_void_v<has_parentTag_t<T>>;

// Check if the mutation has parentShadowView
template <typename T>
using has_parentShadowView_t = decltype(std::declval<T>().parentShadowView);
template <typename T>
inline constexpr bool has_parentShadowView = !std::is_void_v<has_parentShadowView_t<T>>;

// Function to get the parent tag, choosing based on what's available
template <typename T>
auto get_parent_tag(T& mutation) {
    if constexpr (has_parentTag<T>) {
        return mutation.parentTag;
    } else if constexpr (has_parentShadowView<T>) {
        return mutation.parentShadowView.tag;
    } else {
        static_assert(sizeof(T) == 0, "Unknown mutation type");
    }
}

#define MUTATION_PARENT_TAG(mutation) get_parent_tag(mutation)
