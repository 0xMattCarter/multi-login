/// Function to convert decimal tokenId -> hex 1155 json format (64 padded)
function tokenToJson(tokenId) {
  let dec = ethers.BigNumber.from(tokenId);
  let hex = dec.toHexString();
  let pad = 64 - hex.length + 2;
  let padded = "";
  for (let i = 0; i < pad; i++) {
    padded += "0";
  }
  padded += hex.substring(2);
  return padded;
}

/// Shrinks address to 0xabcd...1234 format
shrinkAddr = (_addr) => {
  return (
    _addr.substring(0, 6) +
    "..." +
    _addr.substring(_addr.length - 4, _addr.length)
  );
};

/// Function to get contract instances (ethers)
getContractInstance = (_addr, _abi, _chainId) => {
  return new ethers.Contract(_addr, _abi, providers[_chainId]);
};

/// Set all account metrics
setPortfolio = async (_account) => {
  /// HTML to change
  let v = document.getElementById("checker");
  let myId = document.getElementById("wallet2");
  let myEmail = document.getElementById("current-email");
  let myLinks = document.getElementById("linked-wallets");
  let myErc20s = document.getElementById("my-erc20s");
  /// Vars to set HTML text
  var _myId = "-";
  var _myEmail = "Not Set";
  var user = Moralis.User.current();
  /// If user
  if (_account != "") {
    v.style.visibility = "visible";
    /// Get current email and add sumbit button
    _myEmail = await user.get("email");
    if (!_myEmail) {
      _myEmail = "Not Set";
    }
    myEmail.innerText = "Current Email: " + _myEmail;
    document
      .getElementById("submit-email")
      .addEventListener("click", submitEmail);
    /// Set shrunk user Id
    _myId = shrinkAddr(user.id);
    myId.innerText = "User Id: " + _myId;
    /// Draw all linked account divs
    /// Maybe move this to new function
    let links = await getUserAccounts(user);
    myLinks.innerHTML = "";
    for (let i = 1; i < links.length; i++) {
      /// Non-primary addrs
      if (links[0] != links[i]) {
        let d = document.createElement("div"),
          el = document.createElement("p"),
          btn = document.createElement("button");
        d.appendChild(el), d.appendChild(btn), d.classList.add("linked");
        myLinks.appendChild(d);
        el.innerText = links[i];
        btn.innerText = "Remove";
        btn.onclick = () => {
          unlink(links[i]);
        };
      }
    }
    /// Set erc20 balances
    let erc20Packs = await getErc20Tokens(_account, "0x1");
    myErc20s.innerHTML = "";
    for (let i = 0; i < erc20Packs[0].length; i++) {
      let m = document.createElement("div"),
        el1 = document.createElement("div"),
        el2 = document.createElement("div"),
        el3 = document.createElement("div"),
        el4 = document.createElement("a");
      m.classList.add("token-stat"),
        el1.classList.add("sym"),
        el2.classList.add("single-bal"),
        el3.classList.add("mult-bal");
      el4.setAttribute(
        "href",
        "https://etherscan.io/address/" + erc20Packs[0][i]
      ),
        el4.setAttribute("target", "_blank"),
        (el4.innerText = "view");
      m.appendChild(el1),
        m.appendChild(el2),
        m.appendChild(el3),
        m.appendChild(el4);
      myErc20s.appendChild(m);

      el1.innerText = erc20Packs[1][i];
      el2.innerText = (
        parseFloat(erc20Packs[2][i]) /
        10 ** parseInt(erc20Packs[3][i])
      ).toFixed(3);
      el3.innerText = (
        (await getErc20LinkBalances(links, erc20Packs[0][i], "0x1")) /
        10 ** parseInt(erc20Packs[3][i])
      ).toFixed(3);
    }
    /// Sets all network stats, passes all links to use for balance summing
    await setNetworkStats(links);
  }
  /// If no user
  else {
    v.style.visibility = "hidden";
    myLinks.innerHTML = "";
    myId.innerText = "User Id: " + _myId; // shrunk user id
    myEmail.innerText = _myEmail;
  }

  // console.log("setting portfolio");
  // document.getElementById("linked-wallets").innerHTML = ""; // wipes linked-wallets container
  // var wallet1 = "Not Connected";
  // var wallet2 = "-";
  // var chain = "0x0";
  // var balance = "0";
  // var gas = "0";
  // var block = "0";
  // var email = "";
  /// only if logged in and theres an account
  // if (account != "") {
  // linked accounts (in moralis)
  /// iterates through all linked eth accounts
  // for (let i = 0; i < accs.length; i++) {
  //   let thisAcc = ethers.utils.getAddress(accs[i]);
  //   /// non-primary addrs
  //   if (thisAcc != account) {
  //     /// html set up
  //     let d = document.createElement("div");
  //     let el = document.createElement("p");
  //     let btn = document.createElement("button");
  //     d.classList.add("linked");
  //     el.innerText = thisAcc;
  //     btn.innerText = "Remove";
  //     btn.onclick = function () {
  //       unlink(thisAcc);
  //     };
  //     d.appendChild(el);
  //     d.appendChild(btn);
  //     document.getElementById("linked-wallets").appendChild(d);
  //   }
  // }

  /// set all html text
  // document.getElementById("wallet1").innerText =
  //   "Connected Account: " + wallet1;
  // document.getElementById("wallet2").innerText = "User Id: " + wallet2;
  // document.getElementById("chain").innerText = "Chain: " + networks[chain].name;
  // document.getElementById("block").innerText = "Block: " + block;
  // document.getElementById("gas-price").innerText =
  //   "Gas Price: " + parseInt(gas) + " gwei";
  // document.getElementById("balance").innerText =
  //   "Balance: " + parseFloat(balance).toFixed(4) + " " + networks[chain].token;
  // document.getElementById("current-email").innerText =
  //   "Current Email: " + email;
};

/// Get balance for an _account on a specific network (_chainId)
/// eth for 0x1, bnb for 0x38, matic for 0x89, etc
// getNetworkBalance = async (_account, _chainId) => {
//   return ethers.utils.formatUnits(
//     await providers[_chainId].getBalance(_account),
//     "18"
//   );
// };

/// Get erc20 token balance for _account on network _chainId
// getErc20Balance = async (_account, _erc20, _chainId) => {
//   let c = getContractInstance(_erc20, params.erc20abi, _chainId);
//   return (await c.balanceOf(_account)).toString();
// };

/// Gets total balances for all _accounts in each address in _addrs

// getErc20LinkBalances = async (_links, _address, _chainId) => {
//   var total = 0.0;
//   for (let i = 0; i < _links.length; i++) {
//     let b = parseFloat(await getErc20Balance(_links[i], _address, _chainId));
//     total += b;
//   }
//   return total;
// };

/// Get all erc20 tokens for an _account on a specific network (_chainId)
// getErc20Tokens = async (_account, _chainId) => {
//   let cursor = null;
//   let addrs = [];
//   let syms = [];
//   let bals = [];
//   let decs = [];
//   do {
//     const response = await Moralis.Web3API.account.getTokenBalances({
//       chain: _chainId,
//       address: _account,
//       cursor: cursor,
//     });
//     for (const res of response) {
//       addrs.push(ethers.utils.getAddress(res.token_address)),
//         syms.push(res.symbol),
//         bals.push(res.balance),
//         decs.push(res.decimals);
//     }
//     cursor = response.cursor;
//   } while (cursor != "" && cursor != null);
//   return [addrs, syms, bals, decs];
// };

// /**
//  * Function to get all network balances (in base currency)
//  */
// async function getNetworkBalances(_account) {
//   balances = [];
//   for (prov of Object.entries(providers)) {
//     let bal = ethers.utils.formatUnits(await prov[1].getBalance(_account), 18);
//     balances.push(bal);
//     // console.log(prov, prov[1]);
//   }
//   return balances;
// }

// /**
//  * Function to set each network stat box
//  */
// async function setNetworkStats(_accs) {
//   let nets = document.getElementById("nets");
//   nets.innerHTML = "";
//   for (prov of Object.entries(providers)) {
//     let bal = 0.0;
//     /// non-primary addrs
//     for (let i = 0; i < _accs.length; i++) {
//       newBal = parseFloat(
//         ethers.utils.formatUnits(await prov[1].getBalance(_accs[i]), 18)
//       );
//       bal += newBal;
//     }
//     let box = document.createElement("div");
//     let ntk = document.createElement("h2");
//     let blk = document.createElement("h2");
//     let gs = document.createElement("h2");
//     let bln = document.createElement("h2");
//     box.classList.add("net-box");
//     box.appendChild(ntk);
//     box.appendChild(blk);
//     box.appendChild(gs);
//     box.appendChild(bln);
//     ntk.innerText = networks["0x" + prov[1]._network.chainId.toString(16)].name;
//     blk.innerText = "Current Block: " + (await prov[1].getBlock()).number;
//     gs.innerText =
//       "Gas: ~ " +
//       parseInt(await ethers.utils.formatUnits(await prov[1].getGasPrice(), 9)) +
//       " gwei";
//     bln.innerText =
//       "Network Balances: " +
//       bal.toFixed(3) +
//       networks["0x" + prov[1]._network.chainId.toString(16)].token;

//     nets.appendChild(box);
//   }
// }
