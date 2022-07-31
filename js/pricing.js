/**
 * PRICING FUNCTIONS
 * Uses the coingecko api to get the prices of network currencies and erc20 tokens
 */

/// Gets the price of 1 eth | matic | bnb | avax in USD
getNativeInUsd = async (_chainId) => {
  let string =
    "https://api.coingecko.com/api/v3/simple/price?ids=" +
    networks[_chainId].gecko2 +
    "&vs_currencies=usd";
  let resp = await (await fetch(string)).json();
  let usd = resp[networks[_chainId].gecko2]["usd"];
  return usd;
};

/// Gets the price of 1 erc20 token in USD
getTokenPriceInUsd = async (_chainId, _tokenAddress) => {
  try {
    let string =
      "https://api.coingecko.com/api/v3/coins/" +
      networks[_chainId].gecko +
      "/contract/" +
      _tokenAddress +
      "/market_chart/?vs_currency=usd&days=0";
    let resp = await fetch(string);
    let jsn = await resp.json();
    let perOneInUsd = parseFloat(parseFloat(jsn["prices"][0][1]));
    return perOneInUsd;
  } catch (error) {
    console.log("coin gecko fail");
    return 0.0;
  }
};
