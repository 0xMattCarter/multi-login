/**
 * MAIN FUNCTIONS
 */

/**
 * Starts Moralis server
 */
Moralis.start({
  serverUrl: "https://pz3ac4aydbjr.usemoralis.com:2053/server",
  appId: "gcyGZTHHUSMv4th0e3mmky6eLcVrGCuXnvWPx2aO",
});

/**
 * All information for networks
 * ethereum, binance, polygon, avalanche
 */
var networks = {
  "0x0": {
    token: "",
    name: "Not Connected",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/eth/mainnet",
  },
  "0x1": {
    token: "ETH",
    name: "Ethereum",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/eth/mainnet",
    rpc: "https://mainnet.infura.io/v3/",
    blockExplorer: "https://etherscan.io/",
    gecko: "ethereum",
    gecko2: "ethereum",
  },
  "0x38": {
    token: "BNB",
    name: "Binance",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/bsc/mainnet",
    rpc: "https://bsc-dataseed.binance.org/",
    blockExplorer: "https://bscscan.com/",
    gecko: "binance-smart-chain",
    gecko2: "binancecoin",
  },
  "0x89": {
    token: "MATIC",
    name: "Polygon",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/polygon/mainnet",
    rpc: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com/",
    gecko: "polygon-pos",
    gecko2: "matic-network",
  },
  "0xa86a": {
    token: "AVAX",
    name: "Avalanche",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/avalanche/mainnet",
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorer: "https://snowtrace.io/",
    gecko: "avalanche",
    gecko2: "avalanche-2",
  },
};

/**
 * Ethers.js rpc providers
  * ethereum, binance, polygon, avalanche

 */
var providers = {
  "0x1": new ethers.providers.JsonRpcProvider(networks["0x1"].node),
  "0x38": new ethers.providers.JsonRpcProvider(networks["0x38"].node),
  "0x89": new ethers.providers.JsonRpcProvider(networks["0x89"].node),
  "0xa86a": new ethers.providers.JsonRpcProvider(networks["0xa86a"].node),
};

/**
 * Web3.js objects
 * ethereum, binance, polygon, avalanche
 */
var web3js = {
  "0x1": new Web3(networks["0x1"].node),
  "0x38": new Web3(networks["0x38"].node),
  "0x89": new Web3(networks["0x89"].node),
  "0xa89a": new Web3(networks["0xa86a"].node),
};

/**
 * Params to use
 * - none are currently used
 */
const params = {
  erc20abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "authorizer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "nonce",
          type: "bytes32",
        },
      ],
      name: "AuthorizationCanceled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "authorizer",
          type: "address",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "nonce",
          type: "bytes32",
        },
      ],
      name: "AuthorizationUsed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_account",
          type: "address",
        },
      ],
      name: "Blacklisted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "newBlacklister",
          type: "address",
        },
      ],
      name: "BlacklisterChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "burner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Burn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "newMasterMinter",
          type: "address",
        },
      ],
      name: "MasterMinterChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "minter",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Mint",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "minter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "minterAllowedAmount",
          type: "uint256",
        },
      ],
      name: "MinterConfigured",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "oldMinter",
          type: "address",
        },
      ],
      name: "MinterRemoved",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    { anonymous: false, inputs: [], name: "Pause", type: "event" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "newAddress",
          type: "address",
        },
      ],
      name: "PauserChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "newRescuer",
          type: "address",
        },
      ],
      name: "RescuerChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_account",
          type: "address",
        },
      ],
      name: "UnBlacklisted",
      type: "event",
    },
    { anonymous: false, inputs: [], name: "Unpause", type: "event" },
    {
      inputs: [],
      name: "APPROVE_WITH_AUTHORIZATION_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "CANCEL_AUTHORIZATION_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DECREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DOMAIN_SEPARATOR",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "INCREASE_ALLOWANCE_WITH_AUTHORIZATION_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "PERMIT_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "TRANSFER_WITH_AUTHORIZATION_TYPEHASH",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
        { internalType: "uint256", name: "validAfter", type: "uint256" },
        { internalType: "uint256", name: "validBefore", type: "uint256" },
        { internalType: "bytes32", name: "nonce", type: "bytes32" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "approveWithAuthorization",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "authorizer", type: "address" },
        { internalType: "bytes32", name: "nonce", type: "bytes32" },
      ],
      name: "authorizationState",
      outputs: [
        {
          internalType: "enum GasAbstraction.AuthorizationState",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_account", type: "address" }],
      name: "blacklist",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "blacklister",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "authorizer", type: "address" },
        { internalType: "bytes32", name: "nonce", type: "bytes32" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "cancelAuthorization",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "minter", type: "address" },
        {
          internalType: "uint256",
          name: "minterAllowedAmount",
          type: "uint256",
        },
      ],
      name: "configureMinter",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "currency",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "decrement", type: "uint256" },
      ],
      name: "decreaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "decrement", type: "uint256" },
        { internalType: "uint256", name: "validAfter", type: "uint256" },
        { internalType: "uint256", name: "validBefore", type: "uint256" },
        { internalType: "bytes32", name: "nonce", type: "bytes32" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "decreaseAllowanceWithAuthorization",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "increment", type: "uint256" },
      ],
      name: "increaseAllowance",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "increment", type: "uint256" },
        { internalType: "uint256", name: "validAfter", type: "uint256" },
        { internalType: "uint256", name: "validBefore", type: "uint256" },
        { internalType: "bytes32", name: "nonce", type: "bytes32" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "increaseAllowanceWithAuthorization",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "tokenName", type: "string" },
        { internalType: "string", name: "tokenSymbol", type: "string" },
        { internalType: "string", name: "tokenCurrency", type: "string" },
        { internalType: "uint8", name: "tokenDecimals", type: "uint8" },
        { internalType: "address", name: "newMasterMinter", type: "address" },
        { internalType: "address", name: "newPauser", type: "address" },
        { internalType: "address", name: "newBlacklister", type: "address" },
        { internalType: "address", name: "newOwner", type: "address" },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "newName", type: "string" }],
      name: "initializeV2",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_account", type: "address" }],
      name: "isBlacklisted",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "isMinter",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "masterMinter",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_to", type: "address" },
        { internalType: "uint256", name: "_amount", type: "uint256" },
      ],
      name: "mint",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "minter", type: "address" }],
      name: "minterAllowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "nonces",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "paused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pauser",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
        { internalType: "uint256", name: "deadline", type: "uint256" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "permit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "minter", type: "address" }],
      name: "removeMinter",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IERC20",
          name: "tokenContract",
          type: "address",
        },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "rescueERC20",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "rescuer",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "value", type: "uint256" },
        { internalType: "uint256", name: "validAfter", type: "uint256" },
        { internalType: "uint256", name: "validBefore", type: "uint256" },
        { internalType: "bytes32", name: "nonce", type: "bytes32" },
        { internalType: "uint8", name: "v", type: "uint8" },
        { internalType: "bytes32", name: "r", type: "bytes32" },
        { internalType: "bytes32", name: "s", type: "bytes32" },
      ],
      name: "transferWithAuthorization",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_account", type: "address" }],
      name: "unBlacklist",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "unpause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_newBlacklister", type: "address" },
      ],
      name: "updateBlacklister",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_newMasterMinter", type: "address" },
      ],
      name: "updateMasterMinter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_newPauser", type: "address" },
      ],
      name: "updatePauser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "newRescuer", type: "address" },
      ],
      name: "updateRescuer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

/**
 * Log in button
 */
var loggedIn = false;
document.getElementById("login-btn").addEventListener("click", async () => {
  /// Logging in
  if (!loggedIn) {
    if (await authenticate()) {
      loggedIn = true;
      await run();
    }
  }
  /// Logging out
  else {
    if (confirm("Log out?")) {
      await Moralis.User.logOut();
      loggedIn = false;
      await setUserStats(null);
      await run();
    }
  }
});

/**
 * Gets the current Moralis user or asks the client to sign a message to
 * sign in. Metamask or walletconnect
 * @returns if the authentication was succesful and which account was used to sign in
 */
async function authenticate() {
  let user = Moralis.User.current();
  let lastProvider = "";
  /// User remembered
  if (user) {
    lastProvider = user.get("last_provider");
  }
  /// Signing in
  else if (!user) {
    let authRequest = {
      signingMessage: "Sign this message to log in",
      chain: "0x1",
    };
    /// Check to use metamask or wallet connect if mm is available
    if (window.ethereum) {
      if (!confirm("Use your metamask wallet?")) {
        authRequest.provider = "walletconnect";
        lastProvider = "walletconnect";
      }
    }
    /// Ask user to sign login message
    try {
      user = await Moralis.authenticate(authRequest);
      user.set("last_provider", lastProvider);
      await user.save();
    } catch (e) {
      console.log("Failed to sign log in message");
      return false;
    }
  }

  await Moralis.enableWeb3({ provider: lastProvider });

  console.log(
    "signed in user ",
    user,
    `with ${ethers.utils.getAddress(
      ethers.utils.getAddress(user.get("ethAddress"))
    )}`
  );
  await setUserStats(user);
  return true;
}

/**
 * App function that runs on page load and
 * token refreshes
 */
async function run() {
  let user = Moralis.User.current(); // current user
  let accounts = await getUserAccounts(user); // all user's accounts
  let chainId = []; // default multichain
  let currencySel = "native";
  /// Change login btn text
  if (loggedIn) {
    document.getElementById("login-btn").innerText = shrinkAddr(
      ethers.utils.getAddress(user.get("ethAddress"))
    );
    /// Which chain(s) ?
    let chainSel = document.getElementById("chain-selector").value;
    if (chainSel != "0x0") {
      chainId = [chainSel];
    } else {
      chainId = ["0x1", "0x38", "0x89", "0xa86a"];
    }
    /// Which account(s) ?
    let accountSel = document.getElementById("account-selector").value;
    if (accountSel == "all") {
      // do nothing
    } else {
      accounts = accountSel.split(",");
    }
    currencySel = document.getElementById("currency-selector").value;
  } else {
    document.getElementById("login-btn").innerText = "Connect Wallet";
  }
  /// Sets user stats (email, username, etc)
  // await setUserStats(Moralis.User.current());

  /// Sets block stats and user information
  await setNetworkStats(accounts, chainId);
  /// Sets user's tokens
  await setAccountTokens(accounts, chainId, currencySel);
  await setAccountNfts(accounts, chainId, currencySel);
  console.log("session finished");
}
