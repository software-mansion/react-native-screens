// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/tree/v5.6.1

#import "RNSSafeAreaViewShadowView.h"

#if !RCT_NEW_ARCH_ENABLED
#import <React/RCTAssert.h>
#include <math.h>

#import "RNSSafeAreaViewEdges.h"
#import "RNSSafeAreaViewLocalData.h"

// From RCTShadowView.m
typedef NS_ENUM(unsigned int, meta_prop_t) {
  META_PROP_LEFT,
  META_PROP_TOP,
  META_PROP_RIGHT,
  META_PROP_BOTTOM,
  META_PROP_HORIZONTAL,
  META_PROP_VERTICAL,
  META_PROP_ALL,
  META_PROP_COUNT,
};

@implementation RNSSafeAreaViewShadowView {
  RNSSafeAreaViewLocalData *_localData;
  bool _needsUpdate;
  YGValue _marginMetaProps[META_PROP_COUNT];
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    _needsUpdate = false;
    for (unsigned int ii = 0; ii < META_PROP_COUNT; ii++) {
      _marginMetaProps[ii] = YGValueUndefined;
    }
  }
  return self;
}

- (void)extractEdges:(YGValue[])_metaProps
                 top:(CGFloat *)top
               right:(CGFloat *)right
              bottom:(CGFloat *)bottom
                left:(CGFloat *)left
{
  if (_metaProps[META_PROP_ALL].unit == YGUnitPoint) {
    *top = _metaProps[META_PROP_ALL].value;
    *right = _metaProps[META_PROP_ALL].value;
    *bottom = _metaProps[META_PROP_ALL].value;
    *left = _metaProps[META_PROP_ALL].value;
  }

  if (_metaProps[META_PROP_HORIZONTAL].unit == YGUnitPoint) {
    *right = _metaProps[META_PROP_HORIZONTAL].value;
    *left = _metaProps[META_PROP_HORIZONTAL].value;
  }

  if (_metaProps[META_PROP_VERTICAL].unit == YGUnitPoint) {
    *top = _metaProps[META_PROP_VERTICAL].value;
    *bottom = _metaProps[META_PROP_VERTICAL].value;
  }

  if (_metaProps[META_PROP_TOP].unit == YGUnitPoint) {
    *top = _metaProps[META_PROP_TOP].value;
  }

  if (_metaProps[META_PROP_RIGHT].unit == YGUnitPoint) {
    *right = _metaProps[META_PROP_RIGHT].value;
  }

  if (_metaProps[META_PROP_BOTTOM].unit == YGUnitPoint) {
    *bottom = _metaProps[META_PROP_BOTTOM].value;
  }

  if (_metaProps[META_PROP_LEFT].unit == YGUnitPoint) {
    *left = _metaProps[META_PROP_LEFT].value;
  }
}

- (void)updateInsets
{
  if (_localData == nil) {
    return;
  }

  UIEdgeInsets insets = _localData.insets;
  RNSSafeAreaViewEdges edges = _localData.edges;

  CGFloat top = 0;
  CGFloat right = 0;
  CGFloat bottom = 0;
  CGFloat left = 0;

  [self extractEdges:_marginMetaProps top:&top right:&right bottom:&bottom left:&left];
  super.marginTop =
      (YGValue){static_cast<float>([self getEdgeValue:edges.top insetValue:insets.top edgeValue:top]), YGUnitPoint};
  super.marginRight = (YGValue){
      static_cast<float>([self getEdgeValue:edges.right insetValue:insets.right edgeValue:right]), YGUnitPoint};
  super.marginBottom = (YGValue){
      static_cast<float>([self getEdgeValue:edges.bottom insetValue:insets.bottom edgeValue:bottom]), YGUnitPoint};
  super.marginLeft =
      (YGValue){static_cast<float>([self getEdgeValue:edges.left insetValue:insets.left edgeValue:left]), YGUnitPoint};
}

- (CGFloat)getEdgeValue:(BOOL)edgeMode insetValue:(CGFloat)insetValue edgeValue:(CGFloat)edgeValue
{
  return edgeMode ? insetValue + edgeValue : edgeValue;
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  if (_needsUpdate) {
    _needsUpdate = false;
    [self updateInsets];
  }
  [super didSetProps:changedProps];
}

- (void)setLocalData:(RNSSafeAreaViewLocalData *)localData
{
  RCTAssert(
      [localData isKindOfClass:[RNSSafeAreaViewLocalData class]],
      @"Local data object for `RNSSafeAreaViewShadowView` must be `RNSSafeAreaViewLocalData` instance.");

  _localData = localData;
  _needsUpdate = false;
  [self updateInsets];

  [super didSetProps:@[ @"marginTop", @"marginRight", @"marginBottom", @"marginLeft" ]];
}

#define SHADOW_VIEW_MARGIN_PROP(edge, metaProp)     \
  -(void)setMargin##edge : (YGValue)value           \
  {                                                 \
    [super setMargin##edge:value];                  \
    _needsUpdate = true;                            \
    _marginMetaProps[META_PROP_##metaProp] = value; \
  }

SHADOW_VIEW_MARGIN_PROP(, ALL);
SHADOW_VIEW_MARGIN_PROP(Vertical, VERTICAL);
SHADOW_VIEW_MARGIN_PROP(Horizontal, HORIZONTAL);
SHADOW_VIEW_MARGIN_PROP(Top, TOP);
SHADOW_VIEW_MARGIN_PROP(Right, RIGHT);
SHADOW_VIEW_MARGIN_PROP(Bottom, BOTTOM);
SHADOW_VIEW_MARGIN_PROP(Left, LEFT);

@end
#endif // !RCT_NEW_ARCH_ENABLED
