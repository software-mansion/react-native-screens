changed=$(find ios FabricExample/ios -type f -name '*.swift' | tr '\n' ' ')

case "$1" in
    "format") swift-format format --in-place --parallel --configuration=.swift-format $changed;;
    "lint") xcrun swift-format lint --strict --parallel --configuration=.swift-format $changed;;
esac
