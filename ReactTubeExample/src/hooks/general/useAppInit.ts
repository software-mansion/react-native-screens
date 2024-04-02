import {useAccountContext} from "../../context/AccountContext";
import {useMemo} from "react";

export default function useAppInit() {
  const account = useAccountContext();

  const init = useMemo(() => {
    return account?.loginData.accounts?.length === 0
      ? true
      : account?.loginSuccess ?? false;
  }, [account?.loginSuccess, account?.loginData]);

  return {init};
}
