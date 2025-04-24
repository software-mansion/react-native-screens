#import "RNSScreenFooter.h"
#import "RNSScreen.h"
#import "UIView+Pinning.h"

#ifdef RCT_NEW_ARCH_ENABLED

#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSScreenFooter {
  RNSScreenView *_parent;
  NSLayoutConstraint *_heightConstraint;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.translatesAutoresizingMaskIntoConstraints = false;
    _parent = nil;
  }
  return self;
}

- (void)willMoveToSuperview:(UIView *)newSuperview
{
  [super willMoveToSuperview:newSuperview];
  if ([newSuperview isKindOfClass:RNSScreenView.class]) {
    _parent = (RNSScreenView *)newSuperview;
  }
}

- (void)didMoveToSuperview
{
  if (_parent != nil) {
    [self pinToView:_parent.controller.view
          fromEdges:UIRectEdgeLeft | UIRectEdgeRight | UIRectEdgeBottom
         withHeight:@0
        constraints:^(
            NSLayoutConstraint *top,
            NSLayoutConstraint *bottom,
            NSLayoutConstraint *left,
            NSLayoutConstraint *right,
            NSLayoutConstraint *heightConstraint) {
          self->_heightConstraint = heightConstraint;
        }];
  }
}

- (void)layoutSubviews
{
  [super layoutSubviews];

  UIView *firstView = self.subviews.firstObject;
  _heightConstraint.constant = firstView.frame.size.height;

  if (self.onLayout != nil) {
    self.onLayout(self.frame);
  }
}

#ifdef RCT_NEW_ARCH_ENABLED

#pragma Fabric specific

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenFooterComponentDescriptor>();
}

Class<RCTComponentViewProtocol> RNSScreenFooterCls(void)
{
  return RNSScreenFooter.class;
}

#else

#pragma Paper specific

- (void)reactSetFrame:(CGRect)frame
{
  // ignore frame from react
  // this view should be layouted by it's parent screen
  //  [super reactSetFrame:frame];
}

#endif // RCT_NEW_ARCH_ENABLED

@end

@implementation RNSScreenFooterManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RNSScreenFooter new];
}

@end
