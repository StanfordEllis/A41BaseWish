"use client";

import { Archive, CheckCircle2, Heart, Link2, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Address, isAddress } from "viem";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi";
import { baseWishAbi } from "@/lib/abi";
import { config, contractAddress, dataSuffix, isRealContract, shortAddress, zeroAddress } from "@/lib/wagmi";
import { WalletButtons } from "@/components/WalletButtons";

const tags = ["Health", "Travel", "Study", "Work", "Life"];

type Wish = {
  id: bigint;
  author: Address;
  text: string;
  tag: string;
  timestamp: bigint;
  supportCount: bigint;
  fulfilled: boolean;
  archived: boolean;
};

const contract = {
  address: contractAddress,
  abi: baseWishAbi
} as const;

export default function Home() {
  const { address, isConnected } = useAccount();
  const [text, setText] = useState("");
  const [tag, setTag] = useState(tags[0]);
  const [status, setStatus] = useState("");
  const [hash, setHash] = useState<`0x${string}`>();
  const [copied, setCopied] = useState(false);
  const { writeContractAsync, isPending } = useWriteContract({ config });
  const receipt = useWaitForTransactionReceipt({ hash, config });

  const referrer = useMemo(() => {
    if (typeof window === "undefined") return zeroAddress;
    const ref = new URLSearchParams(window.location.search).get("ref");
    return ref && isAddress(ref) ? (ref as Address) : zeroAddress;
  }, []);

  const { data: totalWishes, refetch: refetchCount } = useReadContract({
    ...contract,
    functionName: "wishCount",
    query: { enabled: isRealContract }
  });

  const wishCount = totalWishes ?? 0n;
  const visibleIds = useMemo(() => {
    const ids: bigint[] = [];
    for (let id = wishCount; id > 0n && ids.length < 24; id--) ids.push(id);
    return ids;
  }, [wishCount]);

  const { data: wishReads, refetch: refetchWishes } = useReadContracts({
    contracts: visibleIds.map((id) => ({ ...contract, functionName: "getWish", args: [id] })),
    query: { enabled: isRealContract && visibleIds.length > 0 }
  });

  const { data: stats, refetch: refetchStats } = useReadContracts({
    contracts:
      address && isRealContract
        ? [
            { ...contract, functionName: "walletWishCount", args: [address] },
            { ...contract, functionName: "walletSupportCount", args: [address] },
            { ...contract, functionName: "rewardPoints", args: [address] },
            { ...contract, functionName: "referralOf", args: [address] }
          ]
        : [],
    query: { enabled: Boolean(address && isRealContract) }
  });

  const wishes = useMemo(
    () =>
      (wishReads ?? [])
        .map((read, index) => {
          if (read.status !== "success" || !read.result) return undefined;
          const wish = read.result as unknown as Omit<Wish, "id">;
          return { id: visibleIds[index], ...wish };
        })
        .filter((wish): wish is Wish => Boolean(wish && !wish.archived)),
    [visibleIds, wishReads]
  );

  const walletWishCount = (stats?.[0]?.result as bigint | undefined) ?? 0n;
  const walletSupportCount = (stats?.[1]?.result as bigint | undefined) ?? 0n;
  const rewardPoints = (stats?.[2]?.result as bigint | undefined) ?? 0n;
  const savedReferrer = (stats?.[3]?.result as Address | undefined) ?? zeroAddress;

  const referralLink =
    typeof window !== "undefined" && address ? `${window.location.origin}${window.location.pathname}?ref=${address}` : "";

  useEffect(() => {
    if (receipt.isSuccess) {
      setStatus("Updated");
      void refetchCount();
      void refetchWishes();
      void refetchStats();
    }
  }, [receipt.isSuccess, refetchCount, refetchStats, refetchWishes]);

  const refreshAll = async () => {
    await Promise.all([refetchCount(), refetchWishes(), refetchStats()]);
  };

  async function submitWish() {
    if (!isConnected) {
      setStatus("Choose a wallet below");
      return;
    }
    if (!isRealContract) {
      setStatus("Add NEXT_PUBLIC_CONTRACT_ADDRESS before posting");
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) {
      setStatus("Write a wish first");
      return;
    }

    setStatus("Posting...");
    const tx = await writeContractAsync({
      ...contract,
      functionName: "createWish",
      args: [trimmed, tag, referrer],
      chainId: 8453,
      dataSuffix
    });
    setHash(tx);
    setText("");
    setStatus("Post Another");
  }

  async function writeAction(functionName: "supportWish" | "markFulfilled" | "archiveWish", args: readonly unknown[]) {
    if (!isConnected) {
      setStatus("Connect a wallet first");
      return;
    }
    setStatus("Sending...");
    const tx = await writeContractAsync({
      ...contract,
      functionName,
      args,
      chainId: 8453,
      dataSuffix
    } as any);
    setHash(tx);
    await refreshAll();
  }

  const mainButtonText = !isConnected
    ? "Connect Wallet"
    : isPending
      ? "Posting..."
      : status === "Post Another"
        ? "Post Another"
        : text.trim()
          ? "Post Wish"
          : "Write a Wish";

  return (
    <main className="min-h-screen pb-24">
      <section id="wish" className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7d7891]">
              <Sparkles className="h-3.5 w-3.5" />
              Base Mini App
            </div>
            <h1 className="mt-3 text-4xl font-bold text-[#302b3e] sm:text-5xl">BaseWish</h1>
            <p className="mt-2 text-base text-[#665f77]">Write wishes. Share support on Base.</p>
          </div>
          <WalletButtons />
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[8px] border border-white/75 bg-white/74 p-4 shadow-note backdrop-blur">
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value.slice(0, 280))}
              placeholder="Write a wish, a tiny plan, or a goal..."
              className="min-h-32 w-full resize-none rounded-[8px] border border-[#ddd6ef] bg-[#fffefe] p-4 text-base outline-none transition placeholder:text-[#aaa3b9] focus:border-[#a891d7] focus:ring-4 focus:ring-[#e7ddff]"
            />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <select
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                className="h-11 rounded-[8px] border border-[#ddd6ef] bg-white px-3 text-sm font-semibold text-[#4d465f] outline-none"
              >
                {tags.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={submitWish}
                disabled={isPending || receipt.isLoading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#332f3d] px-5 text-sm font-bold text-white shadow-note transition hover:bg-[#4a435e] disabled:opacity-65"
              >
                <Send className="h-4 w-4" />
                {mainButtonText}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-[#706981]">
              <span>{text.length}/280</span>
              <span>{status}</span>
            </div>
          </div>

          <aside className="grid gap-3">
            <Stat label="Total wishes" value={wishCount.toString()} />
            <Stat label="Your wishes" value={walletWishCount.toString()} />
            <Stat label="Supports sent" value={walletSupportCount.toString()} />
            <Stat label="Reward points" value={rewardPoints.toString()} />
          </aside>
        </div>

        <section id="wall" className="pt-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-[#332f3d]">Public wish wall</h2>
            <button
              type="button"
              onClick={refreshAll}
              className="rounded-[8px] border border-[#ddd6ef] bg-white/78 px-3 py-2 text-sm font-semibold text-[#5a526d]"
            >
              Refresh
            </button>
          </div>

          <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishes.map((wish, index) => (
              <article
                key={wish.id.toString()}
                className="min-h-56 rounded-[8px] border border-white/80 bg-[#fff8c9] p-4 shadow-note transition hover:-translate-y-0.5"
                style={{ transform: `rotate(${[-1.2, 0.7, -0.4, 1.1][index % 4]}deg)` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-full bg-white/60 px-2.5 py-1 text-xs font-bold text-[#61583a]">{wish.tag || "Life"}</span>
                  {wish.fulfilled ? (
                    <span className="rounded-full bg-[#e3f7e6] px-2.5 py-1 text-xs font-bold text-[#35754a]">Fulfilled</span>
                  ) : null}
                </div>
                <p className="mt-4 min-h-20 whitespace-pre-wrap text-base leading-7 text-[#3d3850]">{wish.text}</p>
                <div className="mt-4 text-xs font-semibold text-[#7c7489]">
                  By {shortAddress(wish.author)} · {new Date(Number(wish.timestamp) * 1000).toLocaleDateString()}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => writeAction("supportWish", [wish.id])}
                    className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[8px] bg-white/68 px-2 text-xs font-bold text-[#514a60]"
                  >
                    <Heart className="h-3.5 w-3.5" />
                    {wish.supportCount.toString()}
                  </button>
                  <button
                    type="button"
                    onClick={() => writeAction("markFulfilled", [wish.id, true])}
                    disabled={address?.toLowerCase() !== wish.author.toLowerCase()}
                    className="inline-flex h-10 items-center justify-center rounded-[8px] bg-white/68 px-2 text-xs font-bold text-[#514a60] disabled:opacity-45"
                    title="Mark Fulfilled"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => writeAction("archiveWish", [wish.id, true])}
                    disabled={address?.toLowerCase() !== wish.author.toLowerCase()}
                    className="inline-flex h-10 items-center justify-center rounded-[8px] bg-white/68 px-2 text-xs font-bold text-[#514a60] disabled:opacity-45"
                    title="Archive"
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {!wishes.length ? (
            <div className="rounded-[8px] border border-dashed border-[#d7cdea] bg-white/58 p-8 text-center text-[#6f687d]">
              The wall is ready for its first wish.
            </div>
          ) : null}
        </section>

        <section id="invite" className="rounded-[8px] border border-white/75 bg-white/72 p-4 shadow-note backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#332f3d]">Referral link</h2>
              <p className="mt-1 break-all text-sm text-[#6c6478]">{referralLink || "Connect wallet to create your invite link"}</p>
              <p className="mt-1 text-xs text-[#8b8496]">Saved referrer: {savedReferrer === zeroAddress ? "None" : shortAddress(savedReferrer)}</p>
            </div>
            <button
              type="button"
              disabled={!referralLink}
              onClick={async () => {
                await navigator.clipboard.writeText(referralLink);
                setCopied(true);
              }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-[#ddd6ef] bg-white px-4 text-sm font-bold text-[#4b455d] disabled:opacity-50"
            >
              <Link2 className="h-4 w-4" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>
      </section>

      <nav className="fixed inset-x-0 bottom-0 border-t border-white/80 bg-white/84 px-4 py-2 shadow-note backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
          {["Wish", "Wall", "Invite"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="rounded-[8px] px-3 py-2 text-center text-sm font-bold text-[#5f5870]">
              {item}
            </a>
          ))}
        </div>
      </nav>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-white/75 bg-white/72 p-4 shadow-note backdrop-blur">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a8399]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#332f3d]">{value}</p>
    </div>
  );
}
