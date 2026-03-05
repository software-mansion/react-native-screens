func rnsLog(_ items: Any..., separator: String = " ", terminator: String = "\n") {
  #if (DEBUG && !RNS_DEBUG_LOGGING_DISABLED) || (!DEBUG && RNS_DEBUG_LOGGING_ENABLED)
    let output = items.map { "\($0)" }.joined(separator: separator)
    Swift.print(output, terminator: terminator)
  #endif
}
