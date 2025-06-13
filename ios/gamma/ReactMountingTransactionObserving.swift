import Foundation

@objc
protocol ReactMountingTransactionObserving {
  func reactMountingTransactionWillMount()
  func reactMountingTransactionDidMount()
}
