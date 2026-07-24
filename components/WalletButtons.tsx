"use client";

import { LogOut, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { coinbaseConnector, metaMaskConnector, okxConnector, shortAddress } from "@/lib/wagmi";

function getInjectedProviders(): any[] {
  if (typeof window === "undefined") return [];
  const eth = window.ethereum;
  if (!eth) return [];
  return Array.isArray(eth.providers) ? eth.providers : [eth];
}

type WalletKind = "okx" | "metamask" | "coinbase";

function isWalletDetected(kind: WalletKind) {
  if (kind === "coinbase") return true;
  if (typeof window === "undefined") return false;
  const providers = getInjectedProviders();
  if (kind === "okx") {
    if (window.okxwallet) return true;
    return providers.some((provider) => !!(provider?.isOkxWallet || provider?.isOKExWallet));
  }
  return providers.some((provider) => !!(provider?.isMetaMask && !provider?.isOkxWallet && !provider?.isOKExWallet));
}

export function WalletButtons() {
  const { address, isConnected } = useAccount();
  const { connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [message, setMessage] = useState("");

  const wallets = useMemo(
    () => [
      { name: "OKX Wallet", connector: okxConnector, detected: "okx" as WalletKind },
      { name: "MetaMask", connector: metaMaskConnector, detected: "metamask" },
      { name: "Coinbase Wallet", connector: coinbaseConnector, detected: "coinbase" }
    ],
    []
  );

  async function connectWallet(wallet: (typeof wallets)[number]) {
    setMessage("");
    if (!isWalletDetected(wallet.detected as WalletKind)) {
      setMessage("Wallet not detected");
      return;
    }

    try {
      await connectAsync({ connector: wallet.connector });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Connection failed");
    }
  }

  if (isConnected) {
    return (
      <div className="rounded-[8px] border border-white/70 bg-white/72 p-3 shadow-note backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d7891]">Connected wallet</p>
            <p className="mt-1 text-sm font-semibold text-[#3d3850]">{shortAddress(address)}</p>
          </div>
          <button
            type="button"
            onClick={() => disconnect()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#ddd6ef] bg-white text-[#635c78] transition hover:border-[#c7b9ef] hover:text-[#332f3d]"
            aria-label="Disconnect"
            title="Disconnect"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-white/70 bg-white/72 p-3 shadow-note backdrop-blur">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {wallets.map((wallet) => (
          <button
            key={wallet.name}
            type="button"
            onClick={() => connectWallet(wallet)}
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#d8d2ea] bg-white px-3 text-sm font-semibold text-[#3d3850] transition hover:border-[#b9aadf] hover:bg-[#fbf8ff] disabled:opacity-60"
          >
            <Wallet className="h-4 w-4" />
            {wallet.name}
          </button>
        ))}
      </div>
      {message ? <p className="mt-2 text-sm text-[#9a4b5c]">{message}</p> : null}
    </div>
  );
}
