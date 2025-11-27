const { spawn, execSync } = require('node:child_process');
const { getCommandLineResponse } = require('./command-line-helpers');

const ALL_DEVICES_TIMEOUT = 120_000; // I expect perform this process in less than 2 minutes
const DEVICE_RESPONSE_TIMEOUT = 60_000; // I expect one device to boot in 60 seconds

/**
 * Spawns multiple emulators and waits for them to be fully booted.
 * @param {string[]} avdNames - Array of AVD names to boot (e.g. ['Nexus_6P', 'Pixel_4'])
 * @returns {string[]} - The list of new ADB serial IDs (e.g. ['emulator-5554', 'emulator-5556'])
 */

function bootDevices(avdNames) {
  if (!avdNames || avdNames.length === 0) return [];

  try {
    const initialDevices = getConnectedEmulators();
    const targetDeviceCount = initialDevices.length + avdNames.length;

    console.log(
      `🎯 Target: Booting ${avdNames.length} devices (${avdNames.join(
        ', ',
      )})...`,
    );
    console.log(
      `   Existing devices: ${initialDevices.length}. Waiting for total: ${targetDeviceCount}`,
    );

    for (const name of avdNames) {
      console.log(`   🚀 Spawning ${name}...`);
      spawnEmulator(name);
      execSync('sleep 1'); // prevent choking the ADB server
    }

    console.log(`⏳ Waiting for devices to appear in ADB...`);

    /**
     * @type {string[]}
     */
    let currentDevices = [];

    const giveUpTimestamp = Date.now() + ALL_DEVICES_TIMEOUT;
    while (Date.now() <= giveUpTimestamp) {
      currentDevices = getConnectedEmulators();

      // Simple progress indicator
      process.stdout.write(
        `\r   Found: ${currentDevices.length} / ${targetDeviceCount}`,
      );

      if (currentDevices.length >= targetDeviceCount) {
        console.log('\n✅ All devices registered.');
        break;
      }

      // check every second
      execSync('sleep 1');
    }

    const newSerials = currentDevices.filter(
      id => !initialDevices.includes(id),
    );

    console.log('⏳ Verifying OS boot status...');

    for (const serial of newSerials) {
      console.log(`   Checking ${serial}...`);
      waitForBootSync(serial);
      console.log(`   ✅ ${serial} is ready.`);
    }

    console.log('🎉 All requested devices are running!');
    return newSerials;
  } catch (error) {
    throw new Error(
      '❌ Error booting devices:\n' + /** @type {Error} */ (error).message,
    );
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
    '-no-boot-anim', // slightly faster
  ];

  const subprocess = spawn('emulator', args, {
    detached: true,
    stdio: 'ignore',
  });
  subprocess.unref();
}

/**
 * @returns {string[]} array of emulators' device ids
 */
function getConnectedEmulators() {
  try {
    return getDeviceIds().filter(line => line.trim().startsWith('emulator-'));
  } catch (_) {
    return [];
  }
}

/**
 * @returns {string[]} list of device adb serials,
 * for both physical and emulated devices, but only
 * with status "device" (connected and ready)
 */
function getDeviceIds() {
  const adbDeviceLines = getCommandLineResponse('adb devices')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  // Remove header line: "List of devices attached"
  adbDeviceLines.shift();
  if (adbDeviceLines.length === 0) {
    throw new Error('The attached device list is empty');
  }
  return adbDeviceLines.map(line => {
    const [id, state] = line.split('\t');
    if (state !== 'device') {
      console.warn(
        `The device (id ${id}) has status "${state}". Its status should be "device" to continue!`,
      );
    }
    return id;
  });
}

/**
 * @param {string} serial
 */
function waitForBootSync(serial) {
  let booted = false;
  const giveUpTimestamp = Date.now() + DEVICE_RESPONSE_TIMEOUT;
  while (!booted) {
    if (giveUpTimestamp < Date.now()) {
      console.warn(`The healthcheck for device ${serial} timed out!`);
      break;
    }
    try {
      const res = execSync(
        `adb -s ${serial} shell getprop sys.boot_completed`,
        {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'], // offline/unauthorized may cause stderr so we ignore it
        },
      ).trim();
      if (res === '1') {
        booted = true;
      } else {
        execSync('sleep 2');
      }
    } catch (_) {
      // if the device is not ready yet the execSync may throw
      // so I catch, sleep, and try again (we are in the loop)
      execSync('sleep 2');
    }
  }
}

module.exports = {
  getDeviceIds,
  bootDevices,
};
