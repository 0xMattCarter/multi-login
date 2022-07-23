/**
 *  Function to convert decimal tokenId -> hex 1155 json format (64 padded)
 */
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

/**
 * Shrinks address to 0xabcd...1234 format
 */
shrinkAddr = (_addr) => {
  return (
    _addr.substring(0, 6) +
    "..." +
    _addr.substring(_addr.length - 4, _addr.length)
  );
};

/**
 * Function to get contract instances (ethers.js)
 */
getContractInstance = (_addr, _abi, _chainId) => {
  return new ethers.Contract(_addr, _abi, providers[_chainId]);
};

/**
 * Function to get tokenomics for a coin from coin gecko
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
  // await fetch(string)
  //   .then((resp) => resp.json())
  //   .then((data) => () {
  //     return data
  //   });
};

coinGeckoGetTokenomics2 = async (_chainId) => {
  let string =
    "https://api.coingecko.com/api/v3/simple/price?ids=" +
    networks[_chainId].gecko2 +
    "&vs_currencies=usd";
  let resp = await fetch(string);
  let jsn = resp.json();
  return jsn;
  // await fetch(string)
  //   .then((resp) => resp.json())
  //   .then((data) => () {
  //     return data
  //   });
};
