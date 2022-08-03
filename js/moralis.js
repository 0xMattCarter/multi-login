/**
 * MORALIS FUNCTIONS
 */

/**
 * Gets nfts for an array of accounts on an
 * array of chainIds
 */
moralisAccountNfts = async (_accounts, _chainIds) => {
  var obj = {};

  for (let j = 0; j < _chainIds.length; j++) {
    obj[_chainIds[j]] = {
      erc721: { tokens: [] },
      erc1155: { tokens: [], balances: {} },
    };
    for (let i = 0; i < _accounts.length; i++) {
      let cursor = null;
      /// Format from moralis to crawl across all results (useful when return is > 100 results)
      do {
        /// Get batch of nfts for _accounts[i] on _chainIds[j]
        const response = await Moralis.Web3API.account.getNFTs({
          chain: _chainIds[j],
          address: _accounts[i],
          cursor: cursor,
        });
        /// Iterate through batch
        for (const res of response.result) {
          /// 721s
          if (res.contract_type == "ERC721") {
            obj[_chainIds[j]].erc721.tokens.push(res);
          }
          /// 1155s
          else if (res.contract_type == "ERC1155") {
            /// First time seeing this token
            if (
              obj[_chainIds[j]].erc1155.balances[
                res.token_address + res.token_id
              ] == undefined
            ) {
              obj[_chainIds[j]].erc1155.tokens.push(res);
              obj[_chainIds[j]].erc1155.balances[
                res.token_address + res.token_id
              ] = parseInt(res.amount);
            }
            /// Duplicate tokens
            else {
              obj[_chainIds[j]].erc1155.balances[
                res.token_address + res.token_id
              ] += parseInt(res.amount);
            }
          }
        }
        cursor = response.cursor;
        /// Step to next batch of results
      } while (cursor != "" && cursor != null);
    }
  }

  return obj;
};

/**
 * Gets tokens and balances for an array of accounts
 * on an array of chainIds
 */
moralisAccountTokens = async (_accounts, _chainIds) => {
  var obj = {};

  for (let j = 0; j < _chainIds.length; j++) {
    obj[_chainIds[j]] = {
      erc20: {
        tokens: [],
        balances: {},
      },
    };
    for (let i = 0; i < _accounts.length; i++) {
      let cursor = null;
      /// Format from moralis to crawl across all results (useful when return is > 100 results)
      do {
        /// Get batch of erc20 tokens of _accounts[i] on _chainIds[j]
        const response = await Moralis.Web3API.account.getTokenBalances({
          chain: _chainIds[j],
          address: _accounts[i],
          cursor: cursor,
        });
        /// Iterate through batch
        for (const res of response) {
          /// First time seeing this token address
          if (
            obj[_chainIds[j]].erc20.balances[res.token_address] == undefined
          ) {
            obj[_chainIds[j]].erc20.tokens.push(res);
            obj[_chainIds[j]].erc20.balances[res.token_address] =
              parseFloat(res.balance) / 10.0 ** parseFloat(res.decimals);
          }
          /// Duplicate tokens
          else {
            obj[_chainIds[j]].erc20.balances[res.token_address] +=
              parseFloat(res.balance) / 10.0 ** parseFloat(res.decimals);
          }
        }
        cursor = response.cursor;
      } while (cursor != "" && cursor != null);
    }
  }

  return obj;
};

/**
 * Gets networks balances for an array of accounts on
 * an array of chainIds
 */
moralisAccountNativeBalances = async (_accounts, _chainIds) => {
  var obj = {};
  for (let j = 0; j < _chainIds.length; j++) {
    var bal = 0.0;
    for (let i = 0; i < _accounts.length; i++) {
      let wei = (
        await Moralis.Web3API.account.getNativeBalance({
          chain: _chainIds[j],
          address: _accounts[i],
        })
      ).balance;
      bal += parseFloat(ethers.utils.formatUnits(wei, 18));
    }
    obj[_chainIds[j]] = bal;
  }
  return obj;
};

/**
 * Returns the lowest price an nft was sold for in the last x days
 * (1, 3, 7, 30, 90, 180)
 * Might want to enhance by averaging sales over x and y days
 */
moralisFloorPrice = async (_contractAddress, _cId) => {
  var options = {
    address: _contractAddress,
    chainId: _cId,
    days: 1,
  };
  var floor = { price: 0.0 };
  try {
    floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
  } catch (error) {
    try {
      options.days = 3;
      floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
    } catch (error) {
      try {
        options.days = 7;
        floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
      } catch (error) {
        try {
          options.days = 30;
          floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
        } catch (error) {
          try {
            options.days = 60;
            floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
          } catch (error) {
            try {
              options.days = 90;
              floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
            } catch (error) {
              try {
                options.days = 180;
                floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
              } catch (error) {
                console.log("No sales the past 180 days, returning 0.0");
                floor = { price: 0.0 };
              }
            }
          }
        }
      }
    }
  }
  // const floor = await Moralis.Web3API.token.getNFTLowestPrice(options);
  price = parseFloat(ethers.utils.formatUnits(floor.price, 18));
  return price;
};

/**
 * Gets the last price an nft was sold for
 */
moralisLastSalePrice = async (_contractAddress, _tId, _cId) => {
  let cursor = null;

  try {
    let resp = await Moralis.Web3API.token.getWalletTokenIdTransfers({
      chain: _cId,
      address: _contractAddress,
      cursor: cursor,
      token_id: _tId,
    });

    /// Look for most recent transfer with value > 0
    let lastPrice = 0.0;
    for (let i = 0; i < resp.total; i++) {
      if (parseInt(resp.result[i].value) > lastPrice) {
        lastPrice = parseInt(resp.result[i].value);
        return parseFloat(ethers.utils.formatUnits(lastPrice.toString(), 18));
      }
    }
    return lastPrice;
  } catch (error) {
    console.log("could not find previous sales");
    return 0.0;
  }
};

/**
 * Gets an nfts floor price, last sold price, and gain (floor - last)
 */
moralisNftTokenomics = async (_contractAddress, _tId, _cId) => {
  let flr = await moralisFloorPrice(_contractAddress, _cId);
  let lst = await moralisLastSalePrice(_contractAddress, _tId, _cId);
  return { floor: flr, last: lst, gain: flr - lst };
};

/**
 * Subscribe to metamask account change event. When an address changes
 * if the new address is not already linked, an element will show giving the option to use this address
 * automatically
 */
// Moralis.onAccountChanged(async (_account) => {
//   console.log()
//   let user = Moralis.User.current();
//   if (user) {
//     let lastProvider = await user.get("last_provider");
//     /// Moralis.link only works with metamask (browser)
//     if (lastProvider == "metamask" || lastProvider == "walletconnect") {
//       console.log("account swap");
//       /// Normalize to checksum
//       _account = ethers.utils.getAddress(_account);
//       let accounts = await getUserAccounts(Moralis.User.current());
//       document.getElementById("possible-link").innerHTML = "";
//       /// If the user has not linked this account yet
//       if (!accounts.includes(_account)) {
//         let el = document.createElement("div"),
//           addr = document.createElement("div"),
//           btn = document.createElement("button");
//         addr.innerText = shrinkAddr(_account);
//         btn.innerText = "add";
//         el.classList.add("link-special"), btn.classList.add("link-btn-special");
//         btn.onclick = () => {
//           superLink(lastProvider);
//         };
//         el.appendChild(addr), el.appendChild(btn);
//         document.getElementById("possible-link").appendChild(el);
//       }
//     }
//   }
// });
