buildscript {
    val buildToolsVersion: String by extra("34.0.0")
    val compileSdkVersion: Int by extra(34)
    val minSdkVersion: Int by extra(23)
    val targetSdkVersion: Int by extra(34)
    val ndkVersion: String by extra("26.1.10909125")
    val kotlinVersion: String by extra("1.9.22")
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}

// Detox repository for `com.wix:detox` dependency specified
// in app build.gradle. This most likely does not have to be
// specified for each project but AFAIK it does not create any conflicts.
// See: https://github.com/wix/Detox/issues/3973#issuecomment-1459895555
// TODO: Find out which project should have it added.
allprojects {
    repositories {
        maven {
            url = uri("$rootDir/../node_modules/detox/Detox-android")
        }
    }
}

apply (plugin= "com.facebook.react.rootproject")
