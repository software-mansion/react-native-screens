#import "RNSScrollEdgeElementComponentView.h"
#import "RNSDefines.h"
#import "RNSScrollViewMarkerComponentView.h"

#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;

@implementation RNSScrollEdgeElementComponentView {
  UIRectEdge _edge;
  __weak RNSScrollViewMarkerComponentView *_Nullable _marker;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  UIScrollEdgeElementContainerInteraction *_Nullable _interaction API_AVAILABLE(ios(26.0), tvos(26.0), visionos(26.0));
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  UILabel *_Nullable _shapeGuide;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

#pragma mark - Private

- (void)initState
{
  static const auto defaultProps = std::make_shared<const react::RNSScrollEdgeElementProps>();
  _props = defaultProps;
  _edge = UIRectEdgeBottom;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, tvOS 26.0, visionOS 26.0, *)) {
    _interaction = [UIScrollEdgeElementContainerInteraction new];

    // UIKit shapes the edge effect around recognized descendants (labels, images, controls) and does not
    // recognize Fabric views, so an empty label covering the bounds makes the whole element count.
    _shapeGuide = [UILabel new];
    _shapeGuide.userInteractionEnabled = NO;
    _shapeGuide.isAccessibilityElement = NO;
    _shapeGuide.accessibilityElementsHidden = YES;
    // Kept as the last subview, after the views Fabric mounts by index.
    [self addSubview:_shapeGuide];

    [NSNotificationCenter.defaultCenter addObserver:self
                                           selector:@selector(scrollViewMarkerDidChangeScrollView:)
                                               name:RNSScrollViewMarkerDidChangeScrollViewNotification
                                             object:nil];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

- (void)updateInteractionWithScrollView:(nullable UIScrollView *)scrollView
{
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, tvOS 26.0, visionOS 26.0, *)) {
    if (_interaction.scrollView == scrollView && _interaction.edge == _edge) {
      return;
    }
    // UIKit picks up the scroll view only when the interaction is added to a view, so it is added again.
    [self removeInteraction:_interaction];
    _interaction.scrollView = scrollView;
    _interaction.edge = _edge;
    [self addInteraction:_interaction];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

- (void)updateLinkedScrollView
{
  if (_shapeGuide == nil) {
    return;
  }

  RNSScrollViewMarkerComponentView *marker = [self findNearestMarker];
  _marker = marker;
  [self updateInteractionWithScrollView:marker.scrollView];
}

/**
 * Walks up from this view. At each ancestor, returns the ancestor if it is a marker, or the first marker
 * in its subtree (pre-order, skipping the branch the walk came from). Stops after the first ancestor that
 * is the view of a view controller, so the search stays within one screen.
 */
- (nullable RNSScrollViewMarkerComponentView *)findNearestMarker
{
  UIView *visitedBranch = self;
  for (UIView *ancestor = self.superview; ancestor != nil; ancestor = ancestor.superview) {
    if ([ancestor isKindOfClass:RNSScrollViewMarkerComponentView.class]) {
      return static_cast<RNSScrollViewMarkerComponentView *>(ancestor);
    }

    for (UIView *subview in ancestor.subviews) {
      if (subview == visitedBranch) {
        continue;
      }
      RNSScrollViewMarkerComponentView *marker = [self findMarkerInSubtree:subview];
      if (marker != nil) {
        return marker;
      }
    }

    if ([ancestor.nextResponder isKindOfClass:UIViewController.class]) {
      return nil;
    }
    visitedBranch = ancestor;
  }
  return nil;
}

/**
 * Does not descend into scroll views, whose content can be large, nor into views of other view controllers.
 */
- (nullable RNSScrollViewMarkerComponentView *)findMarkerInSubtree:(UIView *)view
{
  if ([view isKindOfClass:RNSScrollViewMarkerComponentView.class]) {
    return static_cast<RNSScrollViewMarkerComponentView *>(view);
  }
  if ([view isKindOfClass:UIScrollView.class] || [view.nextResponder isKindOfClass:UIViewController.class]) {
    return nil;
  }
  for (UIView *subview in view.subviews) {
    RNSScrollViewMarkerComponentView *marker = [self findMarkerInSubtree:subview];
    if (marker != nil) {
      return marker;
    }
  }
  return nil;
}

- (nullable UIView *)searchRoot
{
  UIView *root = nil;
  for (UIView *ancestor = self.superview; ancestor != nil; ancestor = ancestor.superview) {
    root = ancestor;
    if ([ancestor.nextResponder isKindOfClass:UIViewController.class]) {
      break;
    }
  }
  return root;
}

- (void)scrollViewMarkerDidChangeScrollView:(NSNotification *)notification
{
  if (self.window == nil) {
    return;
  }

  UIView *marker = notification.object;
  if (marker == _marker || [marker isDescendantOfView:[self searchRoot]]) {
    [self updateLinkedScrollView];
  }
}

#pragma mark - Override

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  if (self.window != nil) {
    [self updateLinkedScrollView];
  }
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  _shapeGuide.frame = self.bounds;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(const react::Props::Shared &)props oldProps:(const react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSScrollEdgeElementProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSScrollEdgeElementProps>(props);

  if (oldComponentProps.edge != newComponentProps.edge) {
    _edge = newComponentProps.edge == react::RNSScrollEdgeElementEdge::Top ? UIRectEdgeTop : UIRectEdgeBottom;
    [self updateInteractionWithScrollView:_marker.scrollView];
  }

  [super updateProps:props oldProps:oldProps];
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)invalidate
{
  [NSNotificationCenter.defaultCenter removeObserver:self
                                                name:RNSScrollViewMarkerDidChangeScrollViewNotification
                                              object:nil];
  _marker = nil;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
  if (@available(iOS 26.0, tvOS 26.0, visionOS 26.0, *)) {
    [self removeInteraction:_interaction];
  }
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScrollEdgeElementComponentDescriptor>();
}

#pragma mark - Dynamic frameworks support

// Needed because of this: https://github.com/facebook/react-native/pull/37274
#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

#pragma mark - View class exposure

Class<RCTComponentViewProtocol> RNSScrollEdgeElementCls(void)
{
  return RNSScrollEdgeElementComponentView.class;
}
