/**
 * PORTFOLIO FUNCTIONS
 */

/**
 * Sets a user's tokens
 * _accounts An array of accounts
 * _chainIds An array of chainIds
 * _currency The currency to display results in
 */
setAccountTokens = async (_accounts, _chainIds, _currency) => {
  console.log("setting user tokens");
  var user = Moralis.User.current();
  const hidden = await user.get("hidden_tokens");
  var usdTotal = 0.0;
  var portfolioSum = "";

  let nativeTokens = await moralisAccountNativeBalances(_accounts, _chainIds);
  let tokens = await moralisAccountTokens(_accounts, _chainIds);

  let gallary20 = document.getElementById("erc20s-section");
  let gallary20Hidden = document.getElementById("hidden-erc20s-section");
  (gallary20.innerHTML = ""), (gallary20Hidden.innerHTML = "");

  for (let j = 0; j < _chainIds.length; j++) {
    var nativePrice = parseFloat(await getNativeInUsd(_chainIds[j])); // in usd
    let nativeBalance = parseFloat(nativeTokens[_chainIds[j]]);
    let nativeUsd = nativePrice * nativeBalance;
    let drawnNative = drawNative(
      networks[_chainIds[j]].name,
      `${nativeBalance.toFixed(4)} ${
        networks[_chainIds[j]].token
      }\n$ ${nativeUsd.toFixed(2)}`
    );
    gallary20.appendChild(drawnNative);
    usdTotal += nativeUsd;
    /// Draw tokens
    for (let i = 0; i < tokens[_chainIds[j]].erc20.tokens.length; i++) {
      let tkn = tokens[_chainIds[j]].erc20.tokens[i];
      let bal = tokens[_chainIds[j]].erc20.balances[tkn.token_address];
      let usdPerTkn = 0.0;
      let isHidden = true;
      if (!hidden.includes(tkn.token_address)) {
        usdPerTkn =
          parseFloat(bal) *
          parseFloat(await getTokenPriceInUsd(_chainIds[j], tkn.token_address));
        isHidden = false;
      }

      let nativePerToken = usdPerTkn / nativePrice;
      let blockscan = `${networks[_chainIds[j]].blockExplorer}address/${
        tkn.token_address
      }`;

      let drawn20 = drawErc20(
        tkn.name,
        tkn.token_address,
        bal.toFixed(3),
        tkn.symbol,
        blockscan,
        _currency == "usd"
          ? "$" + usdPerTkn.toFixed(2)
          : nativePerToken.toFixed(4) + networks[_chainIds[j]].token,
        isHidden
      );

      usdTotal += usdPerTkn;
      nativeBalance += nativePerToken;

      isHidden
        ? gallary20Hidden.appendChild(drawn20)
        : gallary20.appendChild(drawn20);
    }
    portfolioSum += `${nativeBalance.toFixed(4)} ${
      networks[_chainIds[j]].token
    }\n`;
  }
  /// Set summary
  document.getElementById("tt2").innerText = portfolioSum;
  document.getElementById("tt3").innerText = "$" + usdTotal.toFixed(2);

  /// Draw hidden tokens
};

/**
 * Sets a user's nfts
 * _accounts An array of accounts
 * _chainIds An array of chainIds
 * _currency The currency to display results in
 */
setAccountNfts = async (_accounts, _chainIds, _currency) => {
  console.log("setting user nfts");

  let user = Moralis.User.current();
  let hidden = await user.get("hidden_tokens");
  let tokens = await moralisAccountNfts(_accounts, _chainIds);

  let gallary721 = document.getElementById("erc721s-section");
  let gallary721Hidden = document.getElementById("hidden-erc721s-section");
  (gallary721.innerHTML = ""), (gallary721Hidden.innerHTML = "");
  let gallary1155 = document.getElementById("erc1155s-section");
  let gallary1155Hidden = document.getElementById("hidden-erc1155s-section");
  (gallary1155.innerHTML = ""), (gallary1155Hidden.innerHTML = "");

  var usdTotal = 0.0;
  var portfolioSum = "";

  for (let j = 0; j < _chainIds.length; j++) {
    var nativePrice = parseFloat(await getNativeInUsd(_chainIds[j])); // in usd
    var nativeBalance = 0.0;
    for (let i = 0; i < tokens[_chainIds[j]].erc721.tokens.length; i++) {
      let tkn = tokens[_chainIds[j]].erc721.tokens[i];
      let metadata = JSON.parse(tkn.metadata);
      let floor = "floor";
      let last = "last";
      let gain = "gain";
      let isHidden = true;
      let blockscan = `${networks[_chainIds[j]].blockExplorer}address/${
        tkn.token_address
      }`;
      if (!hidden.includes(tkn.token_address)) {
        let tokenomics = await moralisNftTokenomics(
          tkn.token_address,
          tkn.token_id,
          _chainIds[j]
        );

        usdFloor = parseFloat(tokenomics.floor) * nativePrice;
        usdLast = parseFloat(tokenomics.last) * nativePrice;
        usdGain = parseFloat(tokenomics.gain) * nativePrice;

        floor =
          _currency == "usd"
            ? `$${usdFloor.toFixed(2)}`
            : `${tokenomics.floor.toFixed(3)} ${networks[_chainIds[j]].token}`;
        last =
          _currency == "usd"
            ? `$${usdLast.toFixed(2)}`
            : `${tokenomics.last.toFixed(3)} ${networks[_chainIds[j]].token}`;
        gain =
          _currency == "usd"
            ? `$${usdGain.toFixed(2)}`
            : `${tokenomics.gain.toFixed(3)} ${networks[_chainIds[j]].token}`;
        isHidden = false;
        usdTotal += usdFloor;
        nativeBalance += parseFloat(tokenomics.floor);
      }

      let drawn721 = drawErc721(
        tkn.name,
        tkn.token_address,
        tkn.token_id,
        metadata,
        blockscan,
        "Floor: " + floor,
        "Gain: " + gain,
        isHidden
      );

      isHidden
        ? gallary721Hidden.appendChild(drawn721)
        : gallary721.appendChild(drawn721);
    }

    for (let i = 0; i < tokens[_chainIds[j]].erc1155.tokens.length; i++) {
      let tkn = tokens[_chainIds[j]].erc1155.tokens[i];
      let bal = parseInt(
        tokens[_chainIds[j]].erc1155.balances[tkn.token_address + tkn.token_id]
      );
      let metadata = JSON.parse(tkn.metadata);
      let floor = "floor";
      let last = "last";
      let gain = "gain";
      let isHidden = true;
      let blockscan = `${networks[_chainIds[j]].blockExplorer}address/${
        tkn.token_address
      }`;
      if (!hidden.includes(tkn.token_address)) {
        let tokenomics = await moralisNftTokenomics(
          tkn.token_address,
          tkn.token_id,
          _chainIds[j]
        );

        usdFloor = parseFloat(tokenomics.floor) * nativePrice;
        usdLast = parseFloat(tokenomics.last) * nativePrice;
        usdGain = parseFloat(tokenomics.gain) * nativePrice;

        floor =
          _currency == "usd"
            ? `$${usdFloor.toFixed(2)}`
            : `${tokenomics.floor.toFixed(3)} ${networks[_chainIds[j]].token}`;
        last =
          _currency == "usd"
            ? `$${usdLast.toFixed(2)}`
            : `${tokenomics.last.toFixed(3)} ${networks[_chainIds[j]].token}`;
        gain =
          _currency == "usd"
            ? `$${usdGain.toFixed(2)}`
            : `${tokenomics.gain.toFixed(3)} ${networks[_chainIds[j]].token}`;
        isHidden = false;
        usdTotal += usdFloor;
        nativeBalance += parseFloat(tokenomics.floor);
      }

      let drawn1155 = await drawErc1155(
        tkn.name,
        tkn.token_address,
        "#" + tkn.token_id,
        "x" + bal,
        metadata,
        blockscan,
        "Floor: " + floor,
        "Gain: " + gain,
        isHidden
      );

      isHidden
        ? gallary1155Hidden.appendChild(drawn1155)
        : gallary1155.appendChild(drawn1155);
    }

    portfolioSum += `${nativeBalance.toFixed(4)} ${
      networks[_chainIds[j]].token
    }\n`;
  }
  /// Set summary

  document.getElementById("ttt2").innerText = portfolioSum;
  document.getElementById("ttt3").innerText = "$" + usdTotal.toFixed(2);

  /// Draw each erc721
  /// Draw each erc1155
};

/// HTML Drawing functions
drawNative = (_name, _balance) => {
  let el = document.createElement("div"),
    name = document.createElement("div"),
    balance = document.createElement("div");

  el.classList.add("network-balance"),
    el.classList.add("erc20"),
    el.classList.add("background-color1");

  (name.innerText = _name), (balance.innerText = _balance);

  el.appendChild(name), el.appendChild(balance);

  return el;
};
drawErc20 = (
  _name,
  _address,
  _tokenBalance,
  _token,
  _blockscan,
  _tokenValue,
  _isHidden
) => {
  let n = document.createElement("div"),
    name = document.createElement("div"),
    bal = document.createElement("div"),
    value = document.createElement("div"),
    addr = document.createElement("a"),
    btn = document.createElement("button");

  n.classList.add("erc20");
  n.classList.add("background-color1");

  addr.setAttribute("target", "_blank");
  addr.setAttribute("href", _blockscan);

  //   sym.innerText = _token;
  name.innerText = _name;
  bal.innerText = _tokenBalance + " " + _token;
  value.innerText = _tokenValue;
  addr.innerText = shrinkAddr(_address); /// Token address

  if (!_isHidden) {
    btn.innerText = "Hide";
    btn.onclick = () => {
      hideContract(_address);
    };
  } else {
    btn.innerText = "Show";
    btn.onclick = () => {
      unhideContract(_address);
    };
  }

  /// Add HTML
  n.appendChild(name), n.appendChild(bal), n.appendChild(addr);
  if (!_isHidden) n.appendChild(value);
  n.appendChild(btn);

  return n;
};
drawErc721 = (
  _name,
  _address,
  _tokenId,
  _metadata,
  _blockscan,
  _floor,
  _gain,
  _isHidden
) => {
  let n = document.createElement("div"),
    img = document.createElement("img"),
    name = document.createElement("div"),
    floor = document.createElement("div"),
    id = document.createElement("div"),
    // lastSaleDiv = document.createElement("div"),
    gainDiv = document.createElement("div"),
    addr = document.createElement("a"),
    btn = document.createElement("button");

  n.classList.add("erc721"),
    n.classList.add("background-color1"),
    img.classList.add("nft-image");

  addr.setAttribute("href", _blockscan), addr.setAttribute("target", "_blank");

  name.innerText = _name;
  addr.innerText = shrinkAddr(_address);
  floor.innerText = _floor;
  // lastSaleDiv.innerText = theLastSale;
  gainDiv.innerText = _gain;

  if (_name == "Ethereum Name Service") {
    img.setAttribute("src", "images/ens.png");
    id.innerText = _metadata.name;
  } else {
    id.innerText = "#" + _tokenId;
    if (_metadata.image) {
      if (_metadata.image.substring(0, 7) == "ipfs://") {
        img.setAttribute(
          "src",
          _metadata.image.replace(
            "ipfs://",
            "https://nftsource.mypinata.cloud/ipfs/"
          )
        );
      } else {
        img.setAttribute("src", _metadata.image);
      }
    } else {
      /// no metadata
      img.setAttribute("src", "images/bayc.png");
    }
  }

  if (!_isHidden) {
    btn.innerText = "Hide";
    btn.onclick = () => {
      hideContract(_address);
    };
  } else {
    btn.innerText = "Show";
    btn.onclick = () => {
      unhideContract(_address);
    };
  }

  n.appendChild(img), n.appendChild(name), n.appendChild(id);
  if (!_isHidden) n.appendChild(floor);
  if (!_isHidden) n.appendChild(gainDiv);
  n.appendChild(addr), n.appendChild(btn);

  return n;
};
drawErc1155 = async (
  _name,
  _address,
  _tokenId,
  _balance,
  _metadata,
  _blockscan,
  _floor,
  _gain,
  _isHidden
) => {
  let n = document.createElement("div"),
    img = document.createElement("img"),
    name = document.createElement("div"),
    floor = document.createElement("div"),
    id = document.createElement("div"),
    balance = document.createElement("div"),
    // lastSaleDiv = document.createElement("div"),
    gainDiv = document.createElement("div"),
    addr = document.createElement("a"),
    btn = document.createElement("button");

  n.classList.add("erc721"),
    n.classList.add("background-color1"),
    img.classList.add("nft-image");

  addr.setAttribute("href", _blockscan), addr.setAttribute("target", "_blank");

  name.innerText = _name ? _name : _metadata.name;
  balance.innerText = _balance;
  addr.innerText = shrinkAddr(_address);
  balance.innerText = _balance;
  floor.innerText = _floor;
  //   lastSaleDiv.innerText = theLastSale;
  gainDiv.innerText = _gain;
  id.innerText = _tokenId.length > 8 ? shrinkAddr(_tokenId) : _tokenId;

  if (!_isHidden) {
    btn.innerText = "Hide";
    btn.onclick = () => {
      hideContract(_address);
    };
  } else {
    btn.innerText = "Show";
    btn.onclick = () => {
      unhideContract(_address);
    };
  }

  // let hexx = tokenToJson(_tokenId);
  // if (_uri.includes("{}")) {
  //   _uri = _uri.replace("{}", hexx);
  // } else if (_uri.includes("{id}")) {
  //   _uri = _uri.replace("{id}", hexx);
  // }

  // try {
  //   await fetch(_uri);
  //   $.getJSON(_uri, function (_metadata) {

  if (_metadata) {
    if (_metadata.image) {
      if (_metadata.image.substring(0, 7) == "ipfs://") {
        img.setAttribute(
          "src",
          _metadata.image.replace(
            "ipfs://",
            "https://nftsource.mypinata.cloud/ipfs/"
          )
        );
      } else {
        img.setAttribute("src", _metadata.image);
      }
    }
  } else {
    img.setAttribute("src", "images/bayc.png");
  }

  n.appendChild(img),
    n.appendChild(name),
    n.appendChild(id),
    n.appendChild(balance);
  if (!_isHidden) n.appendChild(floor);
  // n.appendChild(lastSaleDiv),
  if (!_isHidden) n.appendChild(gainDiv);
  n.appendChild(addr), n.appendChild(btn);

  return n;
};
