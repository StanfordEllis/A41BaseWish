import { coinbaseWallet, injected } from "wagmi/connectors";
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import type { Address, Hex } from "viem";

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
  }
}

export const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || base.id);
export const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x3Dec861f9810B9ef5240eCC0325763A3d2931F61") as Address;
export const dataSuffix = ((process.env.NEXT_PUBLIC_DATA_SUFFIX || "0x") as Hex);
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

export const config = createConfig({
  chains: [base],
  connectors: [okxConnector, metaMaskConnector, coinbaseConnector],
  transports: {
    [base.id]: http()
  },
  multiInjectedProviderDiscovery: false,
  ssr: true
});

export const shortAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

export const isRealContract = contractAddress !== zeroAddress;
