#import "RNSContentScrollViewDetector.h"
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>

namespace react = facebook::react;

@implementation RNSContentScrollViewDetector {
  UIScrollView *_scrollView;
  UIView *_linkedView;
}

- (void)didMoveToWindow
{
  if (self.window == nil) {
    [self unregisterContentScrollViewInHierarchy];
  } else {
    if ((_scrollView = [self findContentScrollView])) {
      [self registerContentScrollViewInHierarchy];
    }
  }
}

- (UIScrollView *)findContentScrollView
{
  auto scrollView = [RNSScrollViewFinder findScrollViewInFirstDescendantChainFrom:self];
  if (scrollView) {
    RCTLogInfo(@"Found content ScrollView");
    return scrollView;
  }

  return nullptr;
}

- (void)registerContentScrollViewInHierarchy
{
  if (_linkedView != nullptr) {
    RCTLogWarn(
        @"Content ScrollView has already been registered. Make sure to only have one ScrollViewWrapper for content ScrollView.");
    [self unregisterContentScrollViewInHierarchy];
  }

  UIView *parent = self.superview;
  while (parent) {
    if ([parent respondsToSelector:@selector(findContentScrollView)]) {
      RCTLogWarn(
          @"Nested ScrollViewWrapper detected. Make sure to only have one ScrollViewWrapper for content ScrollView.");
    }

    if ([parent respondsToSelector:@selector(registerContentScrollView:)]) {
      [(id<ContentScrollViewConsumer>)parent registerContentScrollView:_scrollView];
      _linkedView = parent;
      RCTLogInfo(@"registered content ScrollView for: %@", parent);
      break;
    }

    parent = parent.superview;
  }
}

- (void)unregisterContentScrollViewInHierarchy
{
  if (_linkedView == nullptr) {
    return;
  }

  [(id<ContentScrollViewConsumer>)_linkedView unregisterContentScrollView:_scrollView];

  RCTLogInfo(@"unregistered content ScrollView for: %@", _linkedView);
  _linkedView = nullptr;
}

#pragma mark - RCTViewComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSContentScrollViewDetectorComponentDescriptor>();
}

@end

#if RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSContentScrollViewDetectorCls(void)
{
  return RNSContentScrollViewDetector.class;
}
#endif // RCT_NEW_ARCH_ENABLED

#if !RCT_NEW_ARCH_ENABLED

@implementation RNSContentScrollViewDetectorViewManager

RCT_EXPORT_MODULE(RNSContentScrollViewDetector);

- (UIView *)view
{
  return [[RNSContentScrollViewDetector alloc] init];
}

@end

#endif // !RCT_NEW_ARCH_ENABLED
