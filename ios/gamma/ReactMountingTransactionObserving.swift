import Foundation

@objc
public protocol ReactMountingTransactionObserving {
  func reactMountingTransactionWillMount()
  func reactMountingTransactionDidMount()
}
