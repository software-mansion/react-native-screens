const { spawn, execSync } = require('node:child_process');
const { assertError } = require('./errors-helpers');

/**
 * Spawns multiple emulators and waits for them to be fully booted.
 * @param {string[]} avdNames - Array of AVD names to boot (e.g. ['Nexus_6P', 'Pixel_4'])
 * @returns {string[]} - The list of new ADB serial IDs (e.g. ['emulator-5554', 'emulator-5556'])
 */
function bootDevices(avdNames) {
  if (!avdNames || avdNames.length === 0) return [];

  try {
    const initialDevices = getConnectedDevices();
    const expectedTotal = initialDevices.length + avdNames.length;

    console.log(`🎯 Target: Booting ${avdNames.length} devices (${avdNames.join(', ')})...`);
    console.log(`   Existing devices: ${initialDevices.length}. Waiting for total: ${expectedTotal}`);

    avdNames.forEach((name) => {
      console.log(`   🚀 Spawning ${name}...`);
      spawnEmulator(name);
      execSync('sleep 1'); // prevent choking the ADB server
    });

    console.log(`⏳ Waiting for devices to appear in ADB...`);
    let currentDevices = [];
    
    while (true) {
      currentDevices = getConnectedDevices();
      
      // Simple progress indicator
      process.stdout.write(`\r   Found: ${currentDevices.length} / ${expectedTotal}   `);

      if (currentDevices.length >= expectedTotal) {
        console.log('\n✅ All devices registered.');
        break;
      }
      
      // Blocking sleep (User Preference)
      execSync('sleep 1');
    }

    const newSerials = currentDevices.filter(id => !initialDevices.includes(id));

    console.log('⏳ Verifying OS boot status...');
    
    for (const serial of newSerials) {
      console.log(`   Checking ${serial}...`);
      waitForBootSync(serial);
      console.log(`   ✅ ${serial} is ready.`);
    }

    console.log('🎉 All requested devices are running!');
    return newSerials;

  } catch (error) {
    assertError(error);
    console.error('❌ Error booting devices:', error.message);
    process.exit(1);
  }
}

/**
 * @param {string} avdName 
 */
function spawnEmulator(avdName) {
  const args = [
    `@${avdName}`,
    '-read-only', 
    '-no-snapshot-save',
    '-no-audio', 
    '-no-window',
    '-no-boot-anim' // slightly faster
  ];

  const subprocess = spawn('emulator', args, {
    detached: true,
    stdio: 'ignore',
  });
  subprocess.unref();
}

/**
 * @returns {string[]} array of device ids 
 */
function getConnectedDevices() {
  try {
    return execSync('adb devices', { encoding: 'utf8' })
      .split('\n')
      .filter(line => line.includes('emulator') || line.includes('device'))
      .map(line => line.split('\t')[0].trim())
      .filter(id => id !== 'List of devices attached');
  } catch (e) {
    assertError(e);
    return [];
  }
}

/**
 * @param {string} serial 
 */
function waitForBootSync(serial) {
  let booted = false;
  while (!booted) {
    try {
      const res = execSync(`adb -s ${serial} shell getprop sys.boot_completed`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'] // offline/unauthorized may cause stderr so we ignore it
      }).trim();
      if (res === '1') {
        booted = true;
      } else {
        execSync('sleep 2');
      }
    } catch (e) {
      assertError(e);
      execSync('sleep 2');
    }
  }
}



module.exports = {
    bootDevices
}
