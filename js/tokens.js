/// ALL FUNCTIONS THAT DEAL WITH GETTING INFORMATION ABOUT AN TOKENS (20/721/1155)

/// Function to get all nfts for an array of _accounts using Moralis
/// Returns [ [721s], [1155s], {1155_balances (addr: tokenid: bal)} ]
getAllNfts = async (_accounts, _chainId) => {
  var all721s = [];
  var all1155s = [];
  var bal1155s = {};
  for (let i = 0; i < _accounts.length; i++) {
    let cursor = null;
    console.log(_chainId, _accounts[i]);
    do {
      const response = await Moralis.Web3API.account.getNFTs({
        chain: _chainId,
        address: _accounts[i],
        cursor: cursor,
      });
      //   console.log(response);
      for (const res of response.result) {
        if (res.contract_type == "ERC721") {
          all721s.push(res);
          console.log(res);
        }
        if (res.contract_type == "ERC1155") {
          all1155s.push(res);
          if (bal1155s[res.token_address + res.token_id] != undefined) {
            bal1155s[res.token_address + res.token_id] += parseInt(res.amount);
          } else {
            bal1155s[res.token_address + res.token_id] = parseInt(res.amount);
          }

          /// sum all balances for
        }
      }
      cursor = response.cursor;
    } while (cursor != "" && cursor != null);
  }
  return [all721s, all1155s, bal1155s];
};

setNfts = async (_accounts, _chainId) => {
  let section721 = document.getElementById("erc721s-section");
  let section1155 = document.getElementById("erc1155s-section");
  section721.innerHTML = "";
  section1155.innerHTML = "";
  // for loop
  // put div showing which network nfts come from
  for (let j = 0; j < _chainId.length; j++) {
    let nfts = await getAllNfts(_accounts, _chainId[j]);
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
      /// take care of this when multichain .blockExplorer

      addr.setAttribute(
        "href",
        networks[_chainId[j]].blockExplorer + "address/" + theNft.token_address
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
        networks[_chainId[j]].blockExplorer + "address/" + theNft.token_address
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

getAll20s = async (_accounts, _chainId) => {
  var all20s = [];
  var bal20s = {};
  var used = [];
  for (let i = 0; i < _accounts.length; i++) {
    let cursor = null;
    console.log(_chainId, _accounts[i]);

    do {
      const response = await Moralis.Web3API.account.getTokenBalances({
        chain: _chainId,
        address: _accounts[i],
        cursor: cursor,
      });
      //   console.log(response);
      for (const res of response) {
        if (!used.includes(res.token_address)) {
          used.push(res.token_address);
          all20s.push(res);
        }
        if (bal20s[res.token_address] != undefined) {
          bal20s[res.token_address] = ethers.BigNumber.from(
            bal20s[res.token_address]
          ).add(ethers.BigNumber.from(res.balance));
        } else {
          bal20s[res.token_address] = ethers.BigNumber.from(res.balance);
        }
      }
      cursor = response.cursor;
    } while (cursor != "" && cursor != null);
  }

  return [all20s, bal20s];
};

set20s = async (_accounts, _chainId) => {
  let section20 = document.getElementById("erc20s-section");
  section20.innerHTML = "";

  for (let j = 0; j < _chainId.length; j++) {
    let erc20s = await getAll20s(_accounts, _chainId[j]);
    let all20s = erc20s[0];
    let bal20s = erc20s[1];
    /// draw each erc20
    for (let i = 0; i < all20s.length; i++) {
      let theToken = all20s[i];
      let n = document.createElement("div"),
        sym = document.createElement("div"),
        bal = document.createElement("div"),
        other = document.createElement("div"),
        addr = document.createElement("a");
      n.classList.add("erc20"), n.classList.add("background-color1");
      sym.innerText = theToken.symbol;
      let b = bal20s[theToken.token_address];
      let d = theToken.decimals;
      bal.innerText = (parseFloat(b) / parseFloat(10 ** parseFloat(d))).toFixed(
        2
      );
      other.innerText = "~ $xxx";
      addr.setAttribute(
        "href",
        networks[_chainId[j]].blockExplorer +
          "address/" +
          theToken.token_address
      ),
        addr.setAttribute("target", "_blank");
      addr.innerText = shrinkAddr(theToken.token_address);
      n.appendChild(sym), n.appendChild(bal), n.appendChild(addr);
      n.appendChild(other), section20.appendChild(n);
    }
  }
};

setTokens = async (_accounts, _chainId) => {
  console.log("setting 20s");
  await set20s(_accounts, _chainId);
  console.log("setting nfts");
  await setNfts(_accounts, _chainId);
};
