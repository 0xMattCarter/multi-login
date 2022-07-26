/// Converts decimal tokenId -> hex 1155 json format (64 padded 0s)
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

/// Returns ethers.js contract instances
getContractInstance = (_addr, _abi, _chainId) => {
  return new ethers.Contract(_addr, _abi, providers[_chainId]);
};

/**
 * Gets tokenomics for an erc20 token from coin gecko
 * _chainId is the chainId the coin belongs to
 * _tokenAddr is the coin's contract address
 */
coinGeckoGetTokenomics = async (_chainId, _tokenAddr) => {
  let string =
    "https://api.coingecko.com/api/v3/coins/" +
    networks[_chainId].gecko +
    "/contract/" +
    _tokenAddr +
    "/market_chart/?vs_currency=usd&days=0";
  let resp = await fetch(string);
  let jsn = resp.json();
  return jsn;
};
/**
 * Gets tokenomics for a network's token (eth, bnb, matic, avax) from coin gecko
 * _chain Id is the network's chainId (0x1, 0x89, etc)
 */
coinGeckoGetTokenomics2 = async (_chainId) => {
  let string =
    "https://api.coingecko.com/api/v3/simple/price?ids=" +
    networks[_chainId].gecko2 +
    "&vs_currencies=usd";
  let resp = await fetch(string);
  let jsn = resp.json();
  return jsn;
};
