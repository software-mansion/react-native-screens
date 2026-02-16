#import <React/RCTConversions.h>

#include <string>
#include <vector>

static inline NSString * _Nullable ToolbarNSStringFromStringProp(const std::string &value)
{
  if (value.empty()) {
    return nil;
  }

  return RCTNSStringFromString(value);
}

static inline NSArray<NSString *> * _Nonnull ToolbarNSStringArrayFromStringArrayProp(
  const std::vector<std::string> &value
)
{
  if (value.empty()) {
    return @[];
  }

  NSMutableArray<NSString *> *result = [NSMutableArray arrayWithCapacity:value.size()];
  for (const auto &item : value) {
    if (!item.empty()) {
      [result addObject:RCTNSStringFromString(item)];
    }
  }

  return result;
}

static inline std::vector<std::string> ToolbarStringVectorFromNSStringArray(NSArray<NSString *> * _Nonnull value)
{
  std::vector<std::string> result;
  result.reserve(value.count);

  for (NSString *item in value) {
    if (item.length == 0) {
      continue;
    }
    result.emplace_back(item.UTF8String);
  }

  return result;
}

#define APPLY_STRING_PROP(target, oldProps, newProps, prop) \
  if (oldProps.prop != newProps.prop) { \
    target.prop = ToolbarNSStringFromStringProp(newProps.prop); \
  }

#define APPLY_STRING_ARRAY_PROP(target, oldProps, newProps, prop) \
  if (oldProps.prop != newProps.prop) { \
    target.prop = ToolbarNSStringArrayFromStringArrayProp(newProps.prop); \
  }

#define APPLY_BOOL_PROP(target, oldProps, newProps, prop) \
  if (oldProps.prop != newProps.prop) { \
    target.prop = newProps.prop; \
  }

// Codegen non-optional doubles default to 0, so we use negative as a sentinel for "unset".
#define APPLY_OPTIONAL_DOUBLE_PROP(target, oldProps, newProps, prop) \
  if (oldProps.prop != newProps.prop) { \
    double value = newProps.prop; \
    target.prop = value >= 0 ? @(value) : nil; \
  }

#define APPLY_COLOR_PROP(target, oldProps, newProps, prop) \
  if (oldProps.prop != newProps.prop) { \
    target.prop = RCTUIColorFromSharedColor(newProps.prop); \
  }

#define APPLY_NUMBER_PROP(target, oldProps, newProps, prop) \
  if (oldProps.prop != newProps.prop) { \
    target.prop = @(newProps.prop); \
  }
