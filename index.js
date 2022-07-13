/**
 * Starts moralis server
 */
Moralis.start({
  serverUrl: "https://okritavfr1iq.usemoralis.com:2053/server",
  appId: "ybVUg3QvLuNe3lDSEdlkbj0tupQAJq1ivE5uJdCD",
  // web3Library: ethers,
});

/**
 * All information for adding networks
 * ethereum, binance, polygon, arbitrum, avalanche, fantom, cronos
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
    blockExplorer: "https://etherscan.io",
  },
  "0x38": {
    token: "BNB",
    name: "Binance",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/bsc/mainnet",
    rpc: " https://bsc-dataseed.binance.org/",
    blockExplorer: "https://bscscan.com",
  },
  "0x89": {
    token: "MATIC",
    name: "Polygon",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/polygon/mainnet",
    rpc: "https://polygon-rpc.com",
    blockExplorer: "https://polygonscan.com/",
  },
  "0xa4b1": {
    token: "ETH",
    name: "Arbitrum",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/arbitrum/mainnet",
    rpc: "https://arb1.arbitrum.io/rpc",
    blockExplorer: "https://arbiscan.io/",
  },
  "0xa86a": {
    token: "AVAX",
    name: "Avalanche",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/avalanche/mainnet",
    rpc: "https://api.avax.network/ext/bc/C/rpc",
    blockExplorer: "https://snowtrace.io/",
  },
  "0xfa": {
    token: "FTM",
    name: "Fantom",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/fantom/mainnet",
    rpc: "https://rpc.ftm.tools",
    blockExplorer: "https://ftmscan.com",
  },
  "0x19": {
    token: "CRO",
    name: "Cronos",
    node: "https://speedy-nodes-nyc.moralis.io/9421d0a1c5f491ee048b60d9/cronos/mainnet",
    rpc: "https://evm.cronos.org",
    blockExplorer: "https://cronoscan.com/",
  },
};

/**
 * All ethers.js rpc providers
 * eth, bnb, matic, arb, avax, fant, cro
 */
var providers = {
  eth: new ethers.providers.JsonRpcProvider(networks["0x1"].node),
  bnb: new ethers.providers.JsonRpcProvider(networks["0x38"].node),
  matic: new ethers.providers.JsonRpcProvider(networks["0x89"].node),
  arb: new ethers.providers.JsonRpcProvider(networks["0xa4b1"].node),
  avax: new ethers.providers.JsonRpcProvider(networks["0xa86a"].node),
  fant: new ethers.providers.JsonRpcProvider(networks["0xfa"].node),
  cro: new ethers.providers.JsonRpcProvider(networks["0x19"].node),
};

/**
 * All web3.js objects
 * eth, bnb, matic, arb, avax, fant, cro
 */
var web3js = {
  eth: new Web3(networks["0x1"].node),
  bnb: new Web3(networks["0x38"].node),
  matic: new Web3(networks["0x89"].node),
  arb: new Web3(networks["0xa4b1"].node),
  avax: new Web3(networks["0xa86a"].node),
  fant: new Web3(networks["0xfa"].node),
  cro: new Web3(networks["0x19"].node),
};

/**
 * ABIs, address', etc
 * NOTE: current values are depricated
 */
const params = {
  nftAddr: "0x852e212DE7d8c531623cEE57Ee1Caa69A18fCaa3",
  nftAbi: [
    {
      inputs: [
        {
          internalType: "string",
          name: "_URI",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "ApprovalCallerNotOwnerNorApproved",
      type: "error",
    },
    {
      inputs: [],
      name: "ApprovalQueryForNonexistentToken",
      type: "error",
    },
    {
      inputs: [],
      name: "ApprovalToCurrentOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "ApproveToCaller",
      type: "error",
    },
    {
      inputs: [],
      name: "BalanceQueryForZeroAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "ExceedsMaxSupply",
      type: "error",
    },
    {
      inputs: [],
      name: "InsufficientFunds",
      type: "error",
    },
    {
      inputs: [],
      name: "MintToZeroAddress",
      type: "error",
    },
    {
      inputs: [],
      name: "MintZeroQuantity",
      type: "error",
    },
    {
      inputs: [],
      name: "MintingNotActive",
      type: "error",
    },
    {
      inputs: [],
      name: "OwnerQueryForNonexistentToken",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferCallerNotOwnerNorApproved",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferFromIncorrectOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferToNonERC721ReceiverImplementer",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferToZeroAddress",
      type: "error",
    },
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
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
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
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
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
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [],
      name: "SUPPLY",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "URI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isMinting",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isUnique",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "mintAccessToken",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "price",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_price",
          type: "uint256",
        },
      ],
      name: "setPrice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_URI",
          type: "string",
        },
      ],
      name: "setURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "toggleMinting",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "toggleUnique",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "_URI",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalMints",
      outputs: [
        {
          internalType: "uint256",
          name: "_mints",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "_addr",
          type: "address",
        },
      ],
      name: "withdrawFunds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

/**
 * Main session vars
 */
var cId = "0x1"; // default chain from selector (may not hav)
var web3 = new Web3(networks[cId].node); // web3.js object, ethers object is already present from cdn
var account = ""; // current address connected (checksum)
var loggedIn = false; // if there is a user logged in currently
var provider = new ethers.providers.JsonRpcProvider(networks[cId].node); // web3 provider

Moralis.Web3.onAccountChanged(async function (_account) {
  /// ask if this is new account or same account
  /// if same, do link, if not, re log in
  console.log("mm swap");
  if (
    confirm(
      "Select confirm to link this address to your account, select cancel to create a new User"
    )
  ) {
    let user = Moralis.User.current();
    let has = await user.get("accounts"); // all linked accounts from user
    /// is this address already linked
    for (let i = 0; i < has.length; i++) {
      if (ethers.utils.getAddress(has[i]) == _account) {
        alert("Link Failed.\nThis address is already linked");
        return;
      }
    }
    try {
      await Moralis.link(_account);
      console.log("linked " + _account);
      signedIn = true;
      account = _account;
      await run(_account);
    } catch (error) {
      signedIn = false;
      account = "";
      alert("Link Failed.\nThis address may already have an account with us");
      await run("");
    }
  } else {
    await Moralis.User.logOut();
    signedIn = false;
    let k = await authenticate();
    if (k[0]) {
      loggedIn = true;
      run(k[1]);
    } else {
      run("");
    }
  }
});
/**
 * Log in button
 */
async function signInUser() {
  if (!loggedIn) {
    let k = await authenticate();
    if (k[0]) {
      await run(k[1]);
    }
  }
}
/**
 * Log out button
 */
async function signOutUser() {
  if (loggedIn && confirm("Sign out?")) {
    console.log("signed out user", Moralis.User.current(), account);
    // cId = "0x1";
    loggedIn = false;
    // account = "";
    // web3 = new Web3(networks[cId].node);
    // provider = new ethers.providers.JsonRpcProvider(networks[cId].node);
    await Moralis.User.logOut();
    await run("");
  }
}
/**
 * Link account button
 * If a user switches accounts without loggin out,
 * they may click this btn and add the new account to their accounts list
 */
async function linkUser() {
  if (!loggedIn) {
    alert("You must be logged in to add an account");
    return;
  } else {
    if (window.ethereum) {
      /// reset session vars
      provider = new ethers.providers.Web3Provider(window.ethereum);
      account = ethers.utils.getAddress(
        (await provider.send("eth_requestAccounts", []))[0]
      );

      let user = Moralis.User.current(); // current user
      let has = await user.get("accounts"); // all linked accounts from user
      /// is this address already linked
      for (let i = 0; i < has.length; i++) {
        if (ethers.utils.getAddress(has[i]) == account) {
          alert("Link Failed.\nThis address is already linked");
          return;
        }
      }

      if (confirm("Add " + account + " to your accounts?")) {
        try {
          await Moralis.link(account);
          console.log("linked " + account);
          await run(account);
        } catch (error) {
          alert(
            "Link Failed.\nThis address may already have an account with us"
          );
        }
      } else {
        console.log("rejected linking");
        return;
      }
    }
  }
}

/**
 * Unlink account button
 * Unlinks accounts from user's list of accounts
 */
async function unlink(_account) {
  if (confirm("Remove " + _account + "from your account list?")) {
    await Moralis.unlink(_account);
    console.log(_account + " removed from account list");
    await run(ethers.utils.getAddress(Moralis.account));
  } else {
    return;
  }
}

/**
 * Gets the current user or asks the user to sign a message to authenticate
 * @returns If the authentication was successful
 */
async function authenticate() {
  var wc = true;
  var user;

  /// undo this when fixing wc
  wc = false;
  // if (window.ethereum) {
  //   wc = !confirm("Use your MetaMask wallet ?");
  // } else {
  //   wc = true;
  // }

  /// Sign log in message using wallet connect
  if (wc) {
    try {
      user = await Moralis.authenticate({
        signingMessage: "Sign this transaction to verify key ownership",
        provider: "walletconnect",
      });
      await Moralis.enableWeb3({ provider: "walletconnect" });
    } catch (error) {
      console.log("failed to sign log in message");
      return [false, ""];
    }
  }
  /// Sign log in message using metamask
  else {
    user = Moralis.User.current();
    /// If user remembered
    if (user) {
      await Moralis.enableWeb3();
    }
    /// If no remembered user
    else {
      try {
        user = await Moralis.authenticate({
          signingMessage: "Sign this transaction to verify key ownership",
        });
        await Moralis.enableWeb3();
      } catch (error) {
        console.log("failed to sign log in message");
        return [false, ""];
      }
    }
  }
  /// Log in message signed successfully
  web3 = new Web3(networks[cId].node); // web3.js object
  account = ethers.utils.getAddress(Moralis.account); // checksummed eth address
  provider = new ethers.providers.JsonRpcProvider(networks[cId].node); // web3 provider
  loggedIn = true; // there is a user logged in now
  console.log("signed in user", user, account);
  return [true, account];
}

/**
 * Adds a network to a user's mm wallet if they do not have it already
 * @param {} _cId string of hex code chain Id ("0x1")
 * @returns if network adding was successful
 */
async function addNetwork(_cId) {
  /// only works for mm
  if (window.ethereum) {
    try {
      let chainName = networks[_cId].name;
      let currencyName = networks[_cId].token;
      let currencySymbol = networks[_cId].token;
      let rpc = networks[_cId].rpc;
      let blockExplorer = networks[_cId].blockExplorer;
      /// add network to user's wallet
      await Moralis.addNetwork(
        _cId,
        chainName,
        currencyName,
        currencySymbol,
        rpc,
        blockExplorer
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

// use this to add networks to user's wallets
// async function addNetworkForUser(chainId) {
//   try {
//     await ethereum.request({
//       method: "wallet_switchEthereumChain",
//       params: [{ chainId: chainId }], // Hexadecimal version of 80001, prefixed with 0x
//     });
//   } catch (error) {
//     if (error.code === 4902) {
//       try {
//         await ethereum.request({
//           method: "wallet_addEthereumChain",
//           params: [
//             {
//               chainId: chainId, // Hexadecimal version of 80001, prefixed with 0x
//               chainName: networks[chainId].chainName,
//               nativeCurrency: {
//                 name: networks[chainId].name,
//                 symbol: networks[chainId].symbol,
//                 decimals: networks[chainId].decimals,
//               },
//               rpcUrls: [networks[chainId].rpc],
//               blockExplorerUrls: [networks[chainId].blockExplorer],
//               iconUrls: [""],
//             },
//           ],
//         });
//       } catch (addError) {
//         console.log("Did not add network");
//       }
//     }
//   }
// }

// /**
//  * Called when the selector changes networks
//  * NOTE: May remove this or only use onNetworkChange
//  */
// async function swapNetwork() {
//   if (loggedIn) {
//     let n = document.getElementsByClassName("network-selector")[0];
//     let chainId = n.options[n.selectedIndex].value;
//     console.log("setting default network to chainId " + chainId);
//     try {
//       if (chainId == "0x1") {
//         await Moralis.switchNetwork("0x1");
//       } else {
//         await addNetwork(chainId);
//       }
//       await Moralis.enableWeb3();

//       cId = chainId;
//       web3 = new Web3(networks[cId].node);
//       provider = new ethers.providers.JsonRpcProvider(networks[cId].node);
//       await run(Moralis.);
//     } catch (error) {
//       console.log("Failed to switch networks");
//     }
//   }
// }

/**
 * App function that runs each refresh/login/logout/etc
 */
async function run(_account) {
  await setPortfolio(_account);
  console.log("session finished");
}

// example of contract write
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

// if (window.ethereum) {
//   provider = new ethers.providers.Web3Provider(window.ethereum);
// }
