/// Starts Moralis server
Moralis.start({
  serverUrl: "https://pz3ac4aydbjr.usemoralis.com:2053/server",
  appId: "gcyGZTHHUSMv4th0e3mmky6eLcVrGCuXnvWPx2aO",
});
/// All information for adding networks
/// ethereum, binance, polygon, avalanche
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
    rpc: " https://bsc-dataseed.binance.org/",
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
    gecko: "avalance",
    gecko2: "avalanche-2",
  },
};
/// All ethers.js rpc providers
/// eth, bnb, matic, avax
var providers = {
  "0x1": new ethers.providers.JsonRpcProvider(networks["0x1"].node),
  "0x38": new ethers.providers.JsonRpcProvider(networks["0x38"].node),
  "0x89": new ethers.providers.JsonRpcProvider(networks["0x89"].node),
  "0xa86a": new ethers.providers.JsonRpcProvider(networks["0xa86a"].node),
};
/// All web3.js objects
/// eth, bnb, matic, arb, avax, fant, cro
var web3js = {
  eth: new Web3(networks["0x1"].node),
  bnb: new Web3(networks["0x38"].node),
  matic: new Web3(networks["0x89"].node),
  avax: new Web3(networks["0xa86a"].node),
};
/// ABIs, address', etc
/// NOTE: current values are not used
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
/// When user changes account in metamask
Moralis.onAccountChanged(async (_account) => {
  console.log("account swap");
  /// Normalize to checksum
  _account = ethers.utils.getAddress(_account);
  let accounts = await getUserAccounts(Moralis.User.current());
  document.getElementById("possible-link").innerHTML = "";
  /// If the user has not linked this account yet
  if (!accounts.includes(_account)) {
    let el = document.createElement("div"),
      addr = document.createElement("div"),
      btn = document.createElement("button");
    addr.innerText = shrinkAddr(_account);
    btn.innerText = "add";
    el.classList.add("link-special"), btn.classList.add("link-btn-special");
    btn.onclick = () => {
      link(_account);
    };
    el.appendChild(addr), el.appendChild(btn);
    document.getElementById("possible-link").appendChild(el);
  }
});
/// Login button
var loggedIn = false;
document.getElementById("login-btn").addEventListener("click", async () => {
  /// Logging in
  if (!loggedIn) {
    let k = await authenticate();
    if (k[0]) {
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
/// Gets the current Moralis user or asks user to sign message to sign in
async function authenticate() {
  let user = Moralis.User.current();
  if (!user) {
    // sign-in message
    let authRequest = {
      signingMessage: "Sign this message to log in",
      chain: "0x1",
    };
    // use wallet connect ?
    if (window.ethereum) {
      if (!confirm("Use your metamask wallet?")) {
        authRequest.provider = "walletconnect";
      }
    }
    try {
      user = await Moralis.authenticate(authRequest);
    } catch (e) {
      console.log("Failed to sign log in message");
      return [false, ""];
    }
  }
  await Moralis.enableWeb3();
  await setUserStats(user);
  console.log(
    "signed in user",
    user,
    ethers.utils.getAddress(user.get("ethAddress"))
  );
  return [true, ethers.utils.getAddress(Moralis.account)];
}
/// Function to add a network to user's (mm only) wallet if not already
async function addNetwork(_cId) {
  /// Only adds to metamask (not wallet connect)
  if (window.ethereum) {
    try {
      let ntk = networks[_cId];
      await Moralis.addNetwork(
        _cId,
        ntk.name,
        ntk.token,
        ntk.token,
        ntk.rpc,
        ntk.blockExplorer
      );
      /// switch to network if Moralis.addnetork() doesnt already
      await Moralis.switchNetwork(_cId);
      console.log("added network to metamask");
      return true;
    } catch (error) {
      console.log("failed to add network to metamask", error);
      return false;
    }
  }
}
/// App function that runs each refresh
async function run() {
  let user = Moralis.User.current(); // current user
  let accounts = await getUserAccounts(user); // all user's accounts
  let chainId = []; // default multichain
  /// Change login btn text
  if (loggedIn) {
    document.getElementById("login-btn").innerText = shrinkAddr(
      Moralis.account
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
      console.log(accountSel, accountSel.split(","));
      accounts = accountSel.split(",");
      // console.log(accounts);
      // accounts = accounts.split(",");
      // console.log(account);
    }
  } else {
    document.getElementById("login-btn").innerText = "Connect Wallet";
  }
  /// Sets user stats (email, username, etc)
  // await setUserStats(Moralis.User.current());

  /// Sets block stats and user information
  await setNetworkStats(accounts, chainId);
  /// Sets user's tokens
  await setTokens(accounts, chainId);
  console.log("session finished");
}

/**
 * CONTRACT WRITE EXAMPLES
 */

// async function mint(amount) {
//   var price, cost, writer;
//   if (!signer) {
//     if (confirm("Sign in first ?")) {
//       await signIn("metamask");
//     } else {
//       return;
//     }
//   }
//   let nftContract = getContractInstance(
//     params.nftAddr,
//     params.nftAbi,
//     provider
//   );
//   (price = await nftContract.price()), (cost = price.mul(amount));
//   let ethAmount = ethers.utils.formatUnits(cost, 18);
//   writer = nftContract.connect(signer);
//   if (confirm("Mint " + amount + " tokens for " + ethAmount + " eth")) {
//     try {
//       let tx = await writer.mintAccessToken(amount, { value: cost });
//       await tx.wait();
//       alert(
//         "Your transaction is finished\nCheck it out at goerli.etherscan.com/" +
//           tx.hash
//       );
//       await setStats();
//     } catch (error) {
//       return;
//     }
//   } else {
//     return;
//   }
// }
// start by using chain of wallet or mainnet
// when checking out, we will make network changes per aggrogated txn
//  let x = console.log(x);
//   const signer = provider.getSigner();
//   console.log(signer);
//   let block = await provider.getBlockNumber();
//   let bal = await provider.getBalance(x);
//   let myBN = ethers.BigNumber.from("42");
//   let bnTest = bal.mul(myBN);
//   console.log(block, bal, myBN, bnTest.toString());
//   let nftContract = getContractInstance(
//     params.nftAddr,
//     params.nftAbi,
//     provider
//   );
//   let price = await nftContract.price();
//   let amount = 2;
//   let cost = price.mul(amount);
//   console.log(bal, cost);
//   let write = nftContract.connect(signer);
//   let tx = await write.mintAccessToken(amount, { value: cost });
//   console.log(cost, cost.toString(), tx, "rec", tx.hash);
// }
