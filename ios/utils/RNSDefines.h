#pragma once
#include <type_traits>

#define RNS_IGNORE_SUPER_CALL_BEGIN \
  _Pragma("clang diagnostic push")  \
      _Pragma("clang diagnostic ignored \"-Wobjc-missing-super-calls\"")

#define RNS_IGNORE_SUPER_CALL_END _Pragma("clang diagnostic pop")

// Check if the mutation has parentTag
template <typename T, typename = void>
struct has_parentTag : std::false_type {};
template <typename T>
struct has_parentTag<T, std::void_t<decltype(std::declval<T>().parentTag)>> : std::true_type {};

// Check if the mutation has parentShadowView
template <typename T, typename = void>
struct has_parentShadowView : std::false_type {};
template <typename T>
struct has_parentShadowView<T, std::void_t<decltype(std::declval<T>().parentShadowView)>> : std::true_type {};

// Function to get the parent tag, choosing based on what's available
template <typename T>
auto get_parent_tag(T& mutation) {
    if constexpr (has_parentShadowView<T>::value) {
        return mutation.parentShadowView.tag;
    } else if constexpr (has_parentTag<T>::value) {
        return mutation.parentTag;
    } else {
        static_assert(sizeof(T) == 0, "Unknown mutation type");
    }
}

#define MUTATION_PARENT_TAG(mutation) get_parent_tag(mutation)
