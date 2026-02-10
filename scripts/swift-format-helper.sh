changed=$(find ios Example/ios FabricExample/ios \
  -type d -name build -prune -o \
  -type f -name '*.swift' -print | tr '\n' ' ')

case "$1" in
    "format") swift-format format --in-place --parallel --configuration=.swift-format $changed;;
    "lint") xcrun swift-format lint --strict --parallel --configuration=.swift-format $changed;;
esac
