import { useState, useCallback, useEffect } from "react";
import Web3 from 'web3';

export const useHashAccountsStore: () => [string[], (to: string[]) => string] = () => {
  const getAccounts = () => {
    return window.location.hash.replace(/^#/, '').split(',').filter(Web3.utils.isAddress);

  }
  const [accounts, setAccounts] = useState<string[]>(getAccounts());

  useEffect(() => {
    const handler = () => { setAccounts(getAccounts()); }
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback(to => {
    window.location.hash = to.join(",");
  }, []);

  return [accounts, navigate] as [string[], (to: string[]) => string];
};
