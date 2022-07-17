getPriceOfIn = async (_of, _in) => {
  /// return price of_ in_ using 0x
  let url =
    "https://api.0x.org/swap/v1/price?sellToken=" +
    _of +
    "&buyToken=" +
    _in +
    "&sellAmount=" +
    "1000000000";
  let p = 0.0;
  try {
    await $.getJSON(url, function (metadata) {
      p = parseFloat(metadata.price);
    });
  } catch (error) {
    console.log("error", error, url);
  }
  return p;
};

/**
 * Function to get all nfts for an array of _accounts using Moralis
 * on _chainId
 * Returns [] of 721s[], 1155s[], and balances{addr+tId:bal}
 */
getAllNfts = async (_accounts, _chainId) => {
  var all721s = [],
    all1155s = [],
    bal1155s = {};
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
      }
      cursor = response.cursor;
      /// Step to next batch of results
    } while (cursor != "" && cursor != null);
  }
  return [all721s, all1155s, bal1155s];
};

/**
 * Function to get the erc20 tokens/balances for an array of _accounts
 * on _chainId
 */
getAll20s = async (_accounts, _chainId) => {
  var all20s = [],
    bal20s = {},
    used = [];
  for (let i = 0; i < _accounts.length; i++) {
    let cursor = null;
    /// Format from moralis to crawl across all results (useful when return is > 100 results)
    do {
      /// Get back of erc20 tokens _accounts[i] on _chainId
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
  return [all20s, bal20s];
};

/**
 * Function to set/draw nfts for an array of accounts on an array of chainIds
 */
setNfts = async (_accounts, _chainIds) => {
  let section721 = document.getElementById("erc721s-section"),
    section1155 = document.getElementById("erc1155s-section");
  /// Clear gallaries
  section721.innerHTML = "";
  section1155.innerHTML = "";
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
        id = document.createElement("div"),
        addr = document.createElement("a");
      n.classList.add("erc721"),
        n.classList.add("background-color1"),
        img.classList.add("nft-image");
      if (meta) {
        img.setAttribute("src", meta.image);
        if (theNft.name == "Ethereum Name Service") {
          img.setAttribute("src", "images/ens.png");
        }
      } else {
        img.setAttribute("src", "images/bayc.png");
      }
      addr.setAttribute(
        "href",
        networks[_chainIds[j]].blockExplorer + "address/" + theNft.token_address
      ),
        addr.setAttribute("target", "_blank");
      name.innerText = theNft.name;
      if (theNft.name == "Ethereum Name Service") {
        id.innerText = meta.name;
      } else {
        id.innerText = "#" + theNft.token_id;
      }
      addr.innerText = shrinkAddr(theNft.token_address);
      n.appendChild(img),
        n.appendChild(name),
        n.appendChild(id),
        n.appendChild(addr),
        section721.appendChild(n);
    }
    /// draw each 1155
    for (let i = 0; i < all1155s.length; i++) {
      let theNft = all1155s[i];
      let n = document.createElement("div"),
        img = document.createElement("img"),
        name = document.createElement("div"),
        id = document.createElement("div"),
        bal = document.createElement("div"),
        addr = document.createElement("a");
      n.classList.add("erc721"),
        n.classList.add("background-color1"),
        img.classList.add("nft-image");
      let uri = theNft.token_uri;
      if (uri.includes("{}")) {
        uri.replace("{}", tokenToJson(theNft.token_id));
      }
      try {
        $.getJSON(uri, function (metadata) {
          img.setAttribute("src", metadata.image);
        });
      } catch (error) {
        img.setAttribute("src", "images/bayc.png");
      }
      addr.setAttribute(
        "href",
        networks[_chainIds[j]].blockExplorer + "address/" + theNft.token_address
      ),
        addr.setAttribute("target", "_blank");
      name.innerText = theNft.name;
      bal.innerText = "x" + bal1155s[theNft.token_address + theNft.token_id];
      addr.innerText = shrinkAddr(theNft.token_address);
      theNft.token_id.length > 10
        ? (id.innerText = "#" + shrinkAddr(theNft.token_id))
        : (id.innerText = "#" + theNft.token_id);
      n.appendChild(img),
        n.appendChild(name),
        n.appendChild(id),
        n.appendChild(bal),
        n.appendChild(addr),
        section1155.appendChild(n);
    }
  }
};

/**
 * Function to set/draw erc20s for an array of accounts on an array of chainIds
 */
set20s = async (_accounts, _chainIds) => {
  let section20 = document.getElementById("erc20s-section");
  section20.innerHTML = "";
  let ethTotal = 0.0;

  for (let j = 0; j < _chainIds.length; j++) {
    let erc20s = await getAll20s(_accounts, _chainIds[j]);
    let all20s = erc20s[0];
    let bal20s = erc20s[1];
    /// Draw each erc20
    for (let i = 0; i < all20s.length; i++) {
      let theToken = all20s[i];
      let n = document.createElement("div"),
        sym = document.createElement("div"),
        bal = document.createElement("div"),
        other = document.createElement("div"),
        addr = document.createElement("a");
      n.classList.add("erc20"), n.classList.add("background-color1");
      sym.innerText = theToken.name;
      let b = bal20s[theToken.token_address];
      let d = theToken.decimals;
      bal.innerText =
        (parseFloat(b) / parseFloat(10 ** parseFloat(d))).toFixed(2) +
        " " +
        theToken.symbol;
      // console.log(theToken, b.toString());
      let inEth =
        parseFloat(
          await getPriceOfIn(
            theToken.token_address,
            networks[_chainIds[j]].token
          )
        ) *
        (parseFloat(b) / parseFloat(10 ** parseFloat(d)));
      ethTotal += inEth;
      /// need to work on conversions for non eth networks
      other.innerText =
        inEth < 0.0001
          ? "< 0.0001 " + networks[_chainIds[j]].token
          : inEth.toFixed(4) + " " + networks[_chainIds[j]].token;
      addr.setAttribute(
        "href",
        networks[_chainIds[j]].blockExplorer +
          "address/" +
          theToken.token_address
      ),
        addr.setAttribute("target", "_blank");
      addr.innerText = shrinkAddr(theToken.token_address);
      n.appendChild(sym), n.appendChild(bal), n.appendChild(addr);
      n.appendChild(other), section20.appendChild(n);
      document.getElementById("tt2").innerText = ethTotal.toFixed(5);
      let usdc =
        ethTotal *
        parseFloat(
          await getPriceOfIn(
            "ETH",
            "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
          )
        );
      document.getElementById("tt3").innerText = usdc.toFixed(2) + " USDC";
    }
  }
  document.getElementById("tt2").innerText = ethTotal.toFixed(5);
  let usdc =
    ethTotal *
    parseFloat(
      await getPriceOfIn("ETH", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    );
  document.getElementById("tt3").innerText = usdc.toFixed(2) + " USDC";
};

/**
 * Function to set a user's tokens (erc20/721/1155)
 */
setTokens = async (_accounts, _chainId) => {
  console.log("setting 20s");
  await set20s(_accounts, _chainId);
  console.log("setting nfts");
  await setNfts(_accounts, _chainId);
};
