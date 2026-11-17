// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "RNScreensApps",
    platforms: [.iOS("15.1")],
    products: [
        .library(name: "RNScreensApps", targets: ["RNScreensApps"]),
    ],
    dependencies: [
        // Resolved from the autolinker symlink `<app>/ios/build/generated/autolinking/libs/RNScreensApps`,
        // same layout as the library's Package.swift in the repository root.
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            name: "RNScreensApps",
            dependencies: [
                .product(name: "ReactHeaders", package: "ReactNative"),
                .product(name: "ReactNativeHeaders", package: "ReactNative"),
                .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
                .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
            ],
            path: "ios",
            publicHeadersPath: ".",
            linkerSettings: [
                .linkedFramework("Foundation"),
            ]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
