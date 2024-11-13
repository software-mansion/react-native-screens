#import "RNSScreenFooter.h"
#import "RNSScreen.h"

#ifdef RCT_NEW_ARCH_ENABLED

#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSScreenFooter {
  RNSScreenView *_parent;
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
  //  if ([newSuperview isKindOfClass:RNSScreenView.class]) {
  //    RNSScreenView *screen = (RNSScreenView *)newSuperview;
  //    _parent = (RNSScreenView *)newSuperview;

  //    [NSLayoutConstraint activateConstraints:@[
  //      [NSLayoutConstraint constraintWithItem:self attribute:NSLayoutAttributeBottom
  //      relatedBy:NSLayoutRelationEqual toItem:screen attribute:NSLayoutAttributeBottom multiplier:1.0
  //      constant:0.0], [NSLayoutConstraint constraintWithItem:self attribute:NSLayoutAttributeLeft
  //      relatedBy:NSLayoutRelationEqual toItem:screen attribute:NSLayoutAttributeLeft multiplier:1.0 constant:0.0],
  //      [NSLayoutConstraint constraintWithItem:self attribute:NSLayoutAttributeRight relatedBy:NSLayoutRelationEqual
  //      toItem:screen attribute:NSLayoutAttributeRight multiplier:1.0 constant:0.0], [NSLayoutConstraint
  //      constraintWithItem:self attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:screen
  //      attribute:NSLayoutAttributeTop multiplier:1.0 constant:0.0], [NSLayoutConstraint constraintWithItem:screen
  //      attribute:NSLayoutAttributeBottom relatedBy:NSLayoutRelationEqual toItem:self
  //      attribute:NSLayoutAttributeBottom multiplier:1.0 constant:0.0], [NSLayoutConstraint
  //      constraintWithItem:screen attribute:NSLayoutAttributeLeft relatedBy:NSLayoutRelationEqual toItem:self
  //      attribute:NSLayoutAttributeLeft multiplier:1.0 constant:0.0], [NSLayoutConstraint constraintWithItem:screen
  //      attribute:NSLayoutAttributeRight relatedBy:NSLayoutRelationEqual toItem:self
  //      attribute:NSLayoutAttributeRight multiplier:1.0 constant:0.0], [NSLayoutConstraint constraintWithItem:screen
  //      attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeTop
  //      multiplier:1.0 constant:0.0],
  //    ]];
  //    [self setNeedsLayout];
  //  }
}

- (void)didMoveToSuperview
{
  if (_parent != nil) {
    //    [NSLayoutConstraint activateConstraints:@[
    //      [NSLayoutConstraint constraintWithItem:self
    //                                   attribute:NSLayoutAttributeBottom
    //                                   relatedBy:NSLayoutRelationEqual
    //                                      toItem:_parent
    //                                   attribute:NSLayoutAttributeBottom
    //                                  multiplier:1.0
    //                                    constant:0.0],
    //      [NSLayoutConstraint constraintWithItem:self attribute:NSLayoutAttributeLeft
    //      relatedBy:NSLayoutRelationEqual toItem:_parent attribute:NSLayoutAttributeLeft multiplier:1.0
    //      constant:0.0], [NSLayoutConstraint constraintWithItem:self attribute:NSLayoutAttributeRight
    //      relatedBy:NSLayoutRelationEqual toItem:_parent attribute:NSLayoutAttributeRight multiplier:1.0
    //      constant:0.0], [NSLayoutConstraint constraintWithItem:self attribute:NSLayoutAttributeTop
    //      relatedBy:NSLayoutRelationEqual toItem:_parent attribute:NSLayoutAttributeTop multiplier:1.0
    //      constant:0.0], [NSLayoutConstraint constraintWithItem:_parent attribute:NSLayoutAttributeBottom
    //      relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeBottom multiplier:1.0
    //      constant:0.0], [NSLayoutConstraint constraintWithItem:_parent attribute:NSLayoutAttributeLeft
    //      relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeLeft multiplier:1.0 constant:0.0],
    //      [NSLayoutConstraint constraintWithItem:_parent attribute:NSLayoutAttributeRight
    //      relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeRight multiplier:1.0 constant:0.0],
    //      [NSLayoutConstraint constraintWithItem:_parent attribute:NSLayoutAttributeTop
    //      relatedBy:NSLayoutRelationEqual toItem:self attribute:NSLayoutAttributeTop multiplier:1.0 constant:0.0],
    //    ]];
    //    [self setNeedsLayout];
  }
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  if (self.onLayout != nil) {
    self.onLayout(self.frame);
  }
  //
  //  if (self.subviews.count > 0) {
  //    CGSize childsSize = self.subviews[0].frame.size;
  //
  //  }
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
