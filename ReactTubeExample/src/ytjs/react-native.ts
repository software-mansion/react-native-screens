// React-Native Platform Support
import {ReadableStream} from "web-streams-polyfill";
import {ICache} from "youtubei.js/dist/src/types/Cache.js";
import {Platform} from "youtubei.js/dist/src/utils/Utils.js";
import crypto from "crypto-browserify";
import {FetchFunction} from "youtubei.js/dist/src/types/PlatformShim.js";
import CustomEvent from "youtubei.js/dist/src/platform/polyfills/node-custom-event.js";
import evaluate from "./jinterMetro";
import uuid from "react-native-uuid";

import RNFS from "react-native-fs";

// const meta_url = import.meta.url;
// const is_cjs = !meta_url;
// const __dirname__ = is_cjs ? __dirname : path.dirname(fileURLToPath(meta_url));
//
// const package_json = JSON.parse(readFileSync(path.resolve(__dirname__, is_cjs ? '../package.json' : '../../package.json'), 'utf-8'));
// const repo_url = package_json.homepage?.split('#')[0];

class Cache implements ICache {
  #persistent_directory: string;
  #persistent: boolean;

  constructor(persistent = false, persistent_directory?: string) {
    this.#persistent_directory =
      persistent_directory || Cache.default_persistent_directory;
    this.#persistent = persistent;
  }

  static get temp_directory() {
    return `${RNFS.CachesDirectoryPath}/youtubei.js`;
  }

  static get default_persistent_directory() {
    return [RNFS.DocumentDirectoryPath, "youtubei.js"].join("/");
  }

  get cache_dir() {
    return this.#persistent ? this.#persistent_directory : Cache.temp_directory;
  }

  async #createCache() {
    const dir = this.cache_dir;
    try {
      const cwd = await RNFS.stat(dir);
      if (!cwd.isDirectory()) {
        throw new Error(
          "An unexpected file was found in place of the cache directory",
        );
      }
    } catch (e: any) {
      if (e?.code === "ENOENT") {
        await RNFS.mkdir(dir);
      } else {
        throw e;
      }
    }
  }

  async get(key: string) {
    await this.#createCache();
    const file = [this.cache_dir, key].join("/");
    try {
      const stat = await RNFS.stat(file);
      if (stat.isFile()) {
        const data: Buffer = Buffer.from(await RNFS.readFile(file));
        return data.buffer;
      }
      throw new Error("An unexpected file was found in place of the cache key");
    } catch (e: any) {
      if (e?.code === "ENOENT") {
        return undefined;
      }
      throw e;
    }
  }

  async set(key: string, value: ArrayBuffer) {
    await this.#createCache();
    const file = [this.cache_dir, key].join("/");
    const dec = new TextDecoder();
    await RNFS.writeFile(file, dec.decode(value));
  }

  async remove(key: string) {
    await this.#createCache();
    const file = [this.cache_dir, key].join("/");
    try {
      await RNFS.unlink(file);
    } catch (e: any) {
      if (e?.code === "ENOENT") {
        return;
      }
      throw e;
    }
  }
}

Platform.load({
  runtime: "node",
  info: {
    version: "",
    bugs_url: "",
    repo_url: "",
  },
  server: true,
  Cache: Cache,
  sha1Hash: async (data: string) => {
    return crypto.createHash("sha1").update(data).digest("hex");
  },
  uuidv4() {
    return uuid.v4().toString();
  },
  eval: evaluate,
  fetch: fetch as unknown as FetchFunction,
  Request: Request as unknown as typeof globalThis.Request,
  Response: Response as unknown as typeof globalThis.Response,
  Headers: Headers as unknown as typeof globalThis.Headers,
  FormData: FormData as unknown as typeof globalThis.FormData,
  File: {} as unknown as typeof globalThis.File,
  ReadableStream: ReadableStream,
  CustomEvent: CustomEvent,
});

export * from "youtubei.js/dist/src/platform/lib";
import Innertube from "youtubei.js/dist/src/platform/lib";
export default Innertube;
