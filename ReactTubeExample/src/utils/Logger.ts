import {
  logger,
  consoleTransport,
  configLoggerType,
  transportFunctionType,
} from "react-native-logs";

const allExtensions = ["APP-INIT", "COMMON"];
const nonDebug = [""];

const consoleWarnTransport: transportFunctionType = props => {
  if (props.level.severity === 2) {
    console.warn(props.msg);
  }
};

const config: configLoggerType = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  transport: [consoleTransport, consoleWarnTransport],
  severity: __DEV__ ? "debug" : "error",
  transportOptions: {
    colors: {
      debug: "white",
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
    extensionColors: {
      HOME: "magenta",
      VIDEO: "green",
      CONTENT: "yellow",
    },
  },
  // enabledExtensions: nonDebug,
};

const LOGGER = logger.createLogger(config);

export default LOGGER;
