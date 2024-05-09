// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    val buildToolsVersion: String by extra("33.0.0")
    val compileSdkVersion: Int by extra(33)
    val minSdkVersion: Int by extra(21)
    val targetSdkVersion: Int by extra(33)
    val ndkVersion: String by extra("23.1.7779620")
    val kotlinVersion: String by extra("1.8.22")
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
