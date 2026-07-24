import { baseAccount, coinbaseWallet, injected } from "wagmi/connectors";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base } from "wagmi/chains";
import type { Address, Hex } from "viem";
import { Attribution } from "ox/erc8021";

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
  }
}

export const chainId = base.id;
export const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x3Dec861f9810B9ef5240eCC0325763A3d2931F61") as Address;
export const builderCode = process.env.NEXT_PUBLIC_BUILDER_CODE || "bc_e6kr1v4d";
export const attributionVersion = "v2";
export const dataSuffix = Attribution.toDataSuffix({
  codes: [builderCode]
}) as Hex;
export const zeroAddress = "0x0000000000000000000000000000000000000000" as const;

const findProvider = (matcher: (provider: any) => boolean) => {
  if (typeof window === "undefined") return undefined;
  const ethereum = window.ethereum;
  const providers = ethereum?.providers;
  if (Array.isArray(providers)) return providers.find(matcher);
  if (ethereum && matcher(ethereum)) return ethereum;
  return undefined;
};

export const okxConnector = injected({
  target: {
    id: "okx",
    name: "OKX Wallet",
    provider() {
      if (typeof window === "undefined") return undefined;
      return window.okxwallet || findProvider((provider) => provider?.isOkxWallet || provider?.isOKExWallet);
    }
  }
});

export const metaMaskConnector = injected({
  target: {
    id: "metamask",
    name: "MetaMask",
    provider() {
      return findProvider((provider) => provider?.isMetaMask && !provider?.isOkxWallet && !provider?.isOKExWallet);
    }
  }
});

export const coinbaseConnector = coinbaseWallet({
  appName: "BaseWish",
  preference: "all"
});

export const baseAccountConnector = baseAccount({
  appName: "BaseWish",
  preference: { options: "all" }
});

export const config = createConfig({
  chains: [base],
  connectors: [okxConnector, metaMaskConnector, baseAccountConnector, coinbaseConnector],
  transports: {
    [base.id]: http()
  },
  multiInjectedProviderDiscovery: false,
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true
});

export const shortAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

export const isRealContract = contractAddress !== zeroAddress;
