// TODO: investigate objc - swift interop and deduplicate this code
// This enum needs to follow the RNSOrientation from objc.
@objc
public enum RNSOrientationSwift: Int {
  case inherit
  case all
  case allButUpsideDown
  case portrait
  case portraitUp
  case portraitDown
  case landscape
  case landscapeLeft
  case landscapeRight
}
