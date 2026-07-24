export const baseWishAbi = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "MAX_TAG",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "MAX_TEXT",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "archiveWish",
    inputs: [
      { name: "wishId", type: "uint256", internalType: "uint256" },
      { name: "archived", type: "bool", internalType: "bool" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "createPoints",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "createWish",
    inputs: [
      { name: "text", type: "string", internalType: "string" },
      { name: "tag", type: "string", internalType: "string" },
      { name: "referrer", type: "address", internalType: "address" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getWish",
    inputs: [{ name: "wishId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct BaseWish.Wish",
        components: [
          { name: "author", type: "address", internalType: "address" },
          { name: "text", type: "string", internalType: "string" },
          { name: "tag", type: "string", internalType: "string" },
          { name: "timestamp", type: "uint256", internalType: "uint256" },
          { name: "supportCount", type: "uint256", internalType: "uint256" },
          { name: "fulfilled", type: "bool", internalType: "bool" },
          { name: "archived", type: "bool", internalType: "bool" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "markFulfilled",
    inputs: [
      { name: "wishId", type: "uint256", internalType: "uint256" },
      { name: "fulfilled", type: "bool", internalType: "bool" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "referralOf",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "referrerBonus",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "rewardPoints",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "setPoints",
    inputs: [
      { name: "_createPoints", type: "uint256", internalType: "uint256" },
      { name: "_supportPoints", type: "uint256", internalType: "uint256" },
      { name: "_referrerBonus", type: "uint256", internalType: "uint256" },
      { name: "_userBonus", type: "uint256", internalType: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "supportPoints",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "supportWish",
    inputs: [{ name: "wishId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "userBonus",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "walletSupportCount",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "walletWishCount",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "wishCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "PointsUpdated",
    inputs: [
      { name: "createPoints", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "supportPoints", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "referrerBonus", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "userBonus", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "WishArchived",
    inputs: [
      { name: "wishId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "archived", type: "bool", indexed: false, internalType: "bool" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "WishCreated",
    inputs: [
      { name: "wishId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "author", type: "address", indexed: true, internalType: "address" },
      { name: "text", type: "string", indexed: false, internalType: "string" },
      { name: "tag", type: "string", indexed: false, internalType: "string" },
      { name: "referrer", type: "address", indexed: true, internalType: "address" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "WishFulfilled",
    inputs: [
      { name: "wishId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "fulfilled", type: "bool", indexed: false, internalType: "bool" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "WishSupported",
    inputs: [
      { name: "wishId", type: "uint256", indexed: true, internalType: "uint256" },
      { name: "supporter", type: "address", indexed: true, internalType: "address" },
      { name: "supportCount", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  }
] as const;
