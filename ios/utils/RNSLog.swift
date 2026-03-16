public func rnsLog(_ items: Any..., separator: String = " ", terminator: String = "\n") {
  #if RNS_DEBUG_LOGGING
    let output = items.map { "\($0)" }.joined(separator: separator)
    Swift.print(output, terminator: terminator)
  #endif
}
