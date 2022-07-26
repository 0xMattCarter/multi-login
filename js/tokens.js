/**
 * Gets the usd value of a network's currency (eth | matic | avax | bnb)
 */
_getBaseValue = async (_chainId) => {
  let gecko = await coinGeckoGetTokenomics2(_chainId);
  return parseFloat(gecko[networks[_chainId].gecko2].usd);
};

/**
 * Gets usd value for a token amount
 */
_getTokenInUsd = async (_tokenAddr, _tokenAmount, _chainId) => {
  let gecko = await coinGeckoGetTokenomics(_chainId, _tokenAddr);
  let coinInUsd;
  try {
    coinInUsd = parseFloat(_tokenAmount) * parseFloat(gecko["prices"][0][1]);
  } catch (error) {
    coinInUsd = 0.0;
  }
  return coinInUsd;
};

/**
 * Converts a usd amount to a network amount
 */
_getTokenInBase = async (_tokenInUsd, _chainId) => {
  let gecko = await coinGeckoGetTokenomics2(_chainId);
  let ntkUsd = parseFloat(gecko[networks[_chainId].gecko2].usd);
  let inBaseCurrency = _tokenInUsd / ntkUsd;
  return inBaseCurrency;
};

/**
 * Gets the value of a token amount in usd and (eth | matic | avax | bnb)
 */
getTokenValues = async (_tokenAddr, _tokenAmount, _chainId) => {
  let coinInUsd = await _getTokenInUsd(_tokenAddr, _tokenAmount, _chainId);
  let coinInBase = await _getTokenInBase(coinInUsd, _chainId);
  return [coinInUsd, coinInBase];
};

/**
 * Gets all nfts on for an array of _accounts on specific network using Moralis API
 * Returns [ [721s], [1155s], { addr+id : balance } ]
 */
getAllNfts = async (_accounts, _chainId) => {
  var user = Moralis.User.current();
  var toHide = await user.get("hidden_tokens");
  var all721s = [],
    all1155s = [],
    bal1155s = {},
    hidden = {};
  for (let i = 0; i < _accounts.length; i++) {
    let cursor = null;
    /// Format from moralis to crawl across all results (useful when return is > 100 results)
    do {
      /// Get batch of nfts for _accounts[i] on _chainId
      const response = await Moralis.Web3API.account.getNFTs({
        chain: _chainId,
        address: _accounts[i],
        cursor: cursor,
      });
      /// Iterate through batch
      for (const res of response.result) {
        /// 721s
        if (res.contract_type == "ERC721") {
          all721s.push(res);
        }
        /// 1155s
        else if (res.contract_type == "ERC1155") {
          all1155s.push(res);
          /// Cummulative balances of duplicate token ids (and contracts)
          if (bal1155s[res.token_address + res.token_id] != undefined) {
            bal1155s[res.token_address + res.token_id] += parseInt(res.amount);
          } else {
            bal1155s[res.token_address + res.token_id] = parseInt(res.amount);
          }
        }
        hidden[res.token_address] = toHide.includes(res.token_address);
      }
      cursor = response.cursor;
      /// Step to next batch of results
    } while (cursor != "" && cursor != null);
  }
  return [all721s, all1155s, bal1155s, hidden];
};
/**
 * Function to set/draw nfts for an array of accounts on an array of chainIds
 */
setNfts = async (_accounts, _chainIds) => {
  let user = Moralis.User.current();
  let toHide = await user.get("hidden_tokens");
  let section721 = document.getElementById("erc721s-section"),
    section1155 = document.getElementById("erc1155s-section");

  let section721Hidden = document.getElementById("hidden-erc721s-section"),
    section1155Hidden = document.getElementById("hidden-erc1155s-section");
  /// Clear gallaries
  (section721.innerHTML = ""), (section1155.innerHTML = "");
  (section721Hidden.innerHTML = ""), (section1155Hidden.innerHTML = "");
  /// Iterate through each _chainId
  for (let j = 0; j < _chainIds.length; j++) {
    let nfts = await getAllNfts(_accounts, _chainIds[j]);
    let all721s = nfts[0];
    let all1155s = nfts[1];
    let bal1155s = nfts[2];
    /// draw each 721
    for (let i = 0; i < all721s.length; i++) {
      let theNft = all721s[i];
      let meta = JSON.parse(theNft.metadata);
      let n = document.createElement("div"),
        img = document.createElement("img"),
        name = document.createElement("div"),
        floor = document.createElement("div"),
        id = document.createElement("div"),
        addr = document.createElement("a");
      n.classList.add("erc721"),
        n.classList.add("background-color1"),
        img.classList.add("nft-image");
      if (meta) {
        img.setAttribute("src", meta.image);
        if (theNft.name == "Ethereum Name Service") {
          img.setAttribute("src", "images/ens.png");
        } else if (meta.image.substring(0, 7) == "ipfs://") {
          // console.log(
          //   "raw ipfs",
          //   meta.image.replace(
          //     "ipfs://",
          //     "https://nftsource.mypinata.cloud/ipfs/"
          //   )
          // );
          img.setAttribute(
            "src",
            meta.image.replace(
              "ipfs://",
              "https://nftsource.mypinata.cloud/ipfs/"
            )
          );
        }
      } else {
        /// no metadata
        img.setAttribute("src", "images/bayc.png");
      }
      addr.setAttribute(
        "href",
        networks[_chainIds[j]].blockExplorer + "address/" + theNft.token_address
      ),
        addr.setAttribute("target", "_blank");
      name.innerText = theNft.name;
      floor.innerText = "getFloor";
      if (theNft.name == "Ethereum Name Service") {
        id.innerText = meta.name;
      } else {
        id.innerText = "#" + theNft.token_id;
      }
      addr.innerText = shrinkAddr(theNft.token_address);
      btn = document.createElement("button");
      btn.innerText = "Hide";
      btn.onclick = () => {
        hideContract(theNft.token_address);
      };
      if (toHide.includes(theNft.token_address)) {
        /// When hidden
        btn.innerText = "Show";
        btn.onclick = () => {
          unhideContract(theNft.token_address);
        };
      } else {
        /// When showing
        btn.innerText = "Hide";
        btn.onclick = () => {
          hideContract(theNft.token_address);
        };
      }

      n.appendChild(img),
        n.appendChild(name),
        n.appendChild(id),
        n.appendChild(floor),
        n.appendChild(addr),
        n.appendChild(btn);
      if (toHide.includes(theNft.token_address)) {
        section721Hidden.appendChild(n);
      } else {
        section721.appendChild(n);
      }
    }
    /// draw each 1155
    for (let i = 0; i < all1155s.length; i++) {
      let theNft = all1155s[i];
      let n = document.createElement("div"),
        img = document.createElement("img"),
        name = document.createElement("div"),
        floor = document.createElement("div"),
        id = document.createElement("div"),
        bal = document.createElement("div"),
        addr = document.createElement("a");
      n.classList.add("erc721"),
        n.classList.add("background-color1"),
        img.classList.add("nft-image");
      let uri = theNft.token_uri;
      let hexx = tokenToJson(theNft.token_id);
      if (uri.includes("{}")) {
        uri = uri.replace("{}", hexx);
      }
      if (uri.includes("{id}")) {
        uri = uri.replace("{id}", hexx);
      }
      try {
        await fetch(uri);
        $.getJSON(uri, function (metadata) {
          if (metadata.image.substring(0, 7) == "ipfs://") {
            // console.log(
            //   "raw ipfs",
            //   metadata.image.replace(
            //     "ipfs://",
            //     "https://nftsource.mypinata.cloud/ipfs/"
            //   )
            // );
            img.setAttribute(
              "src",
              metadata.image.replace(
                "ipfs://",
                "https://nftsource.mypinata.cloud/ipfs/"
              )
            );
          } else {
            img.setAttribute("src", metadata.image);
          }
        });
      } catch (error) {
        console.log(error, uri);
        img.setAttribute("src", "images/bayc.png");
      }
      addr.setAttribute(
        "href",
        networks[_chainIds[j]].blockExplorer + "address/" + theNft.token_address
      ),
        addr.setAttribute("target", "_blank");
      name.innerText = theNft.name;
      floor.innerText = "getFloor * bal";

      bal.innerText = "x" + bal1155s[theNft.token_address + theNft.token_id];
      addr.innerText = shrinkAddr(theNft.token_address);
      theNft.token_id.length > 10
        ? (id.innerText = "#" + shrinkAddr(theNft.token_id))
        : (id.innerText = "#" + theNft.token_id);

      btn = document.createElement("button");
      btn.innerText = "Hide";
      btn.onclick = () => {
        hideContract(theNft.token_address);
      };
      if (toHide.includes(theNft.token_address)) {
        /// When hidden
        btn.innerText = "Show";
        btn.onclick = () => {
          unhideContract(theNft.token_address);
        };
      } else {
        /// When showing
        btn.innerText = "Hide";
        btn.onclick = () => {
          hideContract(theNft.token_address);
        };
      }
      n.appendChild(img),
        n.appendChild(name),
        n.appendChild(id),
        n.appendChild(bal),
        n.appendChild(floor),
        n.appendChild(addr),
        n.appendChild(btn);

      if (toHide.includes(theNft.token_address)) {
        section1155Hidden.appendChild(n);
      } else {
        section1155.appendChild(n);
      }
    }
  }
};

/**
 * Gets the erc20s for an array of _accounts on specific network using Moralis API
 * Return eth/usd value after bal20s made
 */
getAll20s = async (_accounts, _chainId) => {
  var all20s = [],
    bal20s = {},
    used = [],
    usdVal = {},
    cIdValue = {},
    hidden = {};
  for (let i = 0; i < _accounts.length; i++) {
    let cursor = null;
    /// Format from moralis to crawl across all results (useful when return is > 100 results)
    do {
      /// Get batch of erc20 tokens of _accounts[i] on _chainId
      const response = await Moralis.Web3API.account.getTokenBalances({
        chain: _chainId,
        address: _accounts[i],
        cursor: cursor,
      });
      /// Iterate through batch
      for (const res of response) {
        /// Already have this token in another account ?
        if (!used.includes(res.token_address)) {
          used.push(res.token_address);
          all20s.push(res);
        }
        /// If already found, sum bals
        if (bal20s[res.token_address] != undefined) {
          bal20s[res.token_address] = ethers.BigNumber.from(
            bal20s[res.token_address]
          ).add(ethers.BigNumber.from(res.balance));
        }
        /// If first time found, set bal
        else {
          bal20s[res.token_address] = ethers.BigNumber.from(res.balance);
        }
      }
      cursor = response.cursor;
    } while (cursor != "" && cursor != null);
  }
  /// Converts token balances to correct display amount (taking into account decimals) and gets values for the amount
  for (let i = 0; i < all20s.length; i++) {
    let theToken = all20s[i];
    let b = bal20s[theToken.token_address],
      d = theToken.decimals;
    let displayBal = parseFloat(b) / parseFloat(10 ** parseFloat(d));
    let tokenVals = await getTokenValues(
      theToken.token_address,
      displayBal,
      _chainId
    );
    usdVal[theToken.token_address] = tokenVals[0];
    cIdValue[theToken.token_address] = tokenVals[1];
    bal20s[theToken.token_address] = displayBal;
  }
  return [all20s, bal20s, usdVal, cIdValue, hidden];
};

/**
 * Function to set/draw erc20s for an array of accounts on an array of chainIds
 */
set20s = async (_accounts, _chainIds) => {
  let user = Moralis.User.current();
  let toHide = await user.get("hidden_tokens");
  let section20 = document.getElementById("erc20s-section");
  let section20Hidden = document.getElementById("hidden-erc20s-section");

  section20.innerHTML = "";
  section20Hidden.innerHTML = "";
  let portfolioTotal = "";
  let usdTotal = 0.0;
  /// Iterate through array of chainIds to check
  for (let j = 0; j < _chainIds.length; j++) {
    /// Network balances
    let ntkBal = await getNetworkBalances(_accounts, _chainIds[j]);
    /// Network balances in usd
    let ntkUsd = parseFloat(await _getBaseValue(_chainIds[j])) * ntkBal;
    /// This networks total (in eth | matic | avax | bnb)
    let thisTotal = parseFloat(ntkBal);
    usdTotal += ntkUsd;
    /// All erc20s and their balances for [_accounts] on _chainId[j]
    let erc20s = await getAll20s(_accounts, _chainIds[j]);
    let all20s = erc20s[0]; // all Moralis objs
    let bal20s = erc20s[1]; // all display balances for tokens
    let usdVals = erc20s[2]; // all usd values for token balances
    let cIdVals = erc20s[3]; // all network values for token balances
    /// Draw each erc20
    for (let i = 0; i < all20s.length; i++) {
      let theToken = all20s[i];
      let displayBal = bal20s[theToken.token_address];
      let coinInUsd = usdVals[theToken.token_address];
      let coinInBase = cIdVals[theToken.token_address];

      /// HTML elements
      let n = document.createElement("div"),
        sym = document.createElement("div"),
        bal = document.createElement("div"),
        other = document.createElement("div"),
        addr = document.createElement("a");

      /// Html classes/etc
      n.classList.add("erc20"), n.classList.add("background-color1");
      addr.setAttribute(
        "href",
        networks[_chainIds[j]].blockExplorer +
          "address/" +
          theToken.token_address
      ),
        addr.setAttribute("target", "_blank");
      /// Html values
      sym.innerText = theToken.name;
      bal.innerText = displayBal.toFixed(2) + " " + theToken.symbol; /// Number of tokens owned (accounting for decimals)
      if (document.getElementById("currency-selector").value == "default") {
        other.innerText =
          coinInBase < 0.0001
            ? "< 0.0001 " + networks[_chainIds[j]].token
            : coinInBase.toFixed(4) + " " + networks[_chainIds[j]].token; /// Value of tokens in network currency
      } else if (document.getElementById("currency-selector").value == "usd") {
        other.innerText =
          coinInUsd < 0.01 ? "< $0.01 " : "$" + coinInUsd.toFixed(2); /// Value of tokens in network currency
      }
      let btn = document.createElement("button");
      if (toHide.includes(theToken.token_address)) {
        /// When hidden
        btn.innerText = "Show";
        btn.onclick = () => {
          unhideContract(theToken.token_address);
        };
      } else {
        /// When showing
        btn.innerText = "Hide";
        btn.onclick = () => {
          hideContract(theToken.token_address);
        };
      }
      addr.innerText = shrinkAddr(theToken.token_address); /// Token address

      /// Add HTML
      n.appendChild(sym),
        n.appendChild(bal),
        n.appendChild(addr),
        n.appendChild(other),
        n.appendChild(btn);

      if (toHide.includes(theToken.token_address)) {
        section20Hidden.appendChild(n);
      } else {
        section20.appendChild(n);
        /// Increment USD total and this network's total
        usdTotal += coinInUsd;
        thisTotal += coinInBase;
      }
    }
    /// Increment portfolio total (for each network selected)
    portfolioTotal +=
      thisTotal.toFixed(5) + " " + networks[_chainIds[j]].token + "\n";

    /// Set portfolio total after each network finishes parsing
    document.getElementById("tt2").innerText = portfolioTotal;
  }
  /// Set portfolio
  document.getElementById("tt2").innerText = portfolioTotal;
  document.getElementById("tt3").innerText = "$" + usdTotal.toFixed(2);
  /// Return portfolio total to sum with NFTs
};

/**
 * Function to set a user's tokens (erc20/721/1155)
 */
setTokens = async (_accounts, _chainId) => {
  console.log("setting tokens");
  await set20s(_accounts, _chainId);
  console.log("setting nfts");
  await setNfts(_accounts, _chainId);
};
