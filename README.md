# BaseWish

BaseWish is a Base Mini App wish wall. Users can repeatedly post wishes, support any wish including their own, mark their own wishes fulfilled, archive their own wishes, and earn simple non-financial reward points.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3001` if port `3000` is already in use.

## Environment

Copy `.env.example` to `.env.local` and fill in the deployed contract address, Base attribution values, and builder code.

## Key Files

- Contract: `contracts/BaseWish.sol`
- Frontend ABI: `lib/abi.ts`
- Wagmi config and ERC-8021 suffix value: `lib/wagmi.ts`
- Wallet buttons: `components/WalletButtons.tsx`
- App UI and write calls: `app/page.tsx`
- Offchain Base attribution meta tag: `app/layout.tsx`

## Verification

```bash
npx tsc --noEmit
npm run build
```
