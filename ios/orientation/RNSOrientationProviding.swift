// TODO: investigate objc - swift interop and deduplicate this code
// This class needs to follow the RNSOrientationProviding from objc.
@objc
public protocol RNSOrientationProvidingSwift {
  func evaluateOrientation() -> RNSOrientationSwift
}
