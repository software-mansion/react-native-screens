package com.swmansion.rnscreens.example;

import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {

    @Rule
    // Replace 'MainActivity' with the value of android:name entry in
    // <activity> in AndroidManifest.xml
    public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);

    @Test
    public void runDetoxTests() {
        DetoxConfig detoxConfig = new DetoxConfig();
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 120;
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 120;
        detoxConfig.rnContextLoadTimeoutSec = (BuildConfig.DEBUG ? 240 : 120);

        Detox.runTests(mActivityRule, detoxConfig);
    }
}
