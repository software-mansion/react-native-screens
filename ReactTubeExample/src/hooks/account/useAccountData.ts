import {useYoutubeContext} from "../../context/YoutubeContext";
import {useEffect, useState} from "react";
import Logger from "../../utils/Logger";
import {useSettings} from "../../utils/SettingsWrapper";

const accountKey = "accountData";

interface AccountCredentials {
  access_token: string;
  refresh_token: string;
  expires: number;
}

interface Account {
  credentials?: AccountCredentials;
}

interface AccountData {
  accounts: Account[];
}

interface LoginData {
  verification_url: string;
  user_code: string;
  device_code: string;
}

const LOGGER = Logger.extend("ACCOUNT");

export default function useAccountData() {
  const {settings, updateSettings, clearAll} = useSettings<AccountData>(
    accountKey,
    {
      accounts: [],
    },
  );
  const [qrCode, setQRCodeData] = useState<LoginData>();
  const [success, setSuccess] = useState(false);
  // TODO: Add success reaction?
  const [loginSuccess, setLoginSuccess] = useState(false);

  const youtube = useYoutubeContext();

  useEffect(() => {
    if (!youtube) {
      LOGGER.debug("No Youtube Context available");
      return;
    }

    LOGGER.debug("Logged in: ", youtube.session.logged_in);

    youtube?.session.on("auth-pending", data => {
      // data.verification_url contains the URL to visit to authenticate.
      // data.user_code contains the code to enter on the website.
      const loginData: LoginData = {
        user_code: data.user_code,
        device_code: data.device_code,
        verification_url: data.verification_url,
      };
      LOGGER.debug("Auth Pending: " + JSON.stringify(data));
      setQRCodeData(loginData);
    });

    youtube.session.on("auth", ({credentials}) => {
      // do something with the credentials, eg; save them in a database.
      LOGGER.info("Sign in successful");
      LOGGER.debug("Credentials: ", JSON.stringify(credentials));
      const account: Account = {
        credentials: {
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token,
          expires: credentials.expires.getDate(),
        },
      };
      updateSettings({
        accounts: [account],
      });
      setQRCodeData(undefined);
      setSuccess(true);
    });

    // 'update-credentials' is fired when the access token expires, if you do not save the updated credentials any subsequent request will fail
    youtube.session.on("update-credentials", ({credentials}) => {
      // do something with the updated credentials
      LOGGER.debug("Credentials update: " + JSON.stringify(credentials));
      const account: Account = {
        credentials: {
          access_token: credentials.access_token,
          refresh_token: credentials.refresh_token,
          expires: credentials.expires.getDate(),
        },
      };
      updateSettings({
        accounts: [account],
      });
    });
  }, [youtube, updateSettings]);

  useEffect(() => {
    if (
      youtube &&
      !youtube.session.logged_in &&
      settings.accounts?.[0]?.credentials
    ) {
      //TODO: Check if user wants to log in?

      LOGGER.debug("Account credentials available");
      const credentials = settings.accounts[0].credentials;
      youtube.session
        .signIn({
          expires: new Date(credentials.expires),
          refresh_token: credentials.refresh_token,
          access_token: credentials.access_token,
        })
        .then(() => {
          LOGGER.info("Successfully logged in");
          setLoginSuccess(true);
        })
        .catch(LOGGER.warn);
    }
  }, [youtube, settings]);

  const login = () => {
    if (!youtube) {
      LOGGER.warn("No Youtube Context available!");
      return;
    }
    youtube.session
      .signIn()
      .then(() => LOGGER.debug("Login succedd"))
      .catch(LOGGER.warn);
    LOGGER.debug("Login triggered");
  };

  const logout = () => {
    if (!youtube) {
      LOGGER.warn("No Youtube Context available!");
      return;
    }
    youtube.session
      .signOut()
      .then(() => {
        updateSettings({
          accounts: [], // Adapt when using multiple accounts
        });
        LOGGER.debug("Logout succeeded");
      })
      .catch(LOGGER.warn);
    LOGGER.debug("Logout triggered");
  };

  return {
    login,
    logout,
    qrCode,
    loginData: settings,
    clearAllData: clearAll,
    loginSuccess,
  };
}
