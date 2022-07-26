/**
 * Function to return the network balance for an array
 * of accounts on _chainId
 */
getNetworkBalances = async (_accounts, _chainId) => {
  let bal = 0.0;
  for (let i = 0; i < _accounts.length; i++) {
    let wei = (
      await Moralis.Web3API.account.getNativeBalance({
        chain: _chainId,
        address: _accounts[i],
      })
    ).balance;
    bal += parseFloat(ethers.utils.formatUnits(wei, 18));
  }
  return bal;
};

/**
 * Gets a network's current block, gas price, and the balance for an array of accounts
 */
getNetworkStats = async (_accounts, _chainId) => {
  if (_accounts.length == 0) {
    return ["", "", ""];
  } else {
    let prov = providers[_chainId];
    let bal = await getNetworkBalances(_accounts, _chainId);
    let block = await prov.getBlockNumber();
    let wei = await prov.getGasPrice();
    let gwei = parseInt(ethers.utils.formatUnits(wei, 9));
    return [bal.toFixed(3), block, gwei];
  }
};

/**
 * Sets network stats for an array of _chainIds
 * Sets _accounts cummulative network balances,
 */
setNetworkStats = async (_accounts, _chainIds) => {
  if (!Moralis.User.current()) {
    console.log("bitch");
    document.getElementById("gas").innerText = "";
    document.getElementById("block").innerText = "";
    document.getElementById("network").innerText = "";
    document.getElementById("base-name").innerText = "";
    document.getElementById("base-bal").innerText = "";
  }
  /// Single chain viewing, logged in
  else {
    //(_chainIds.length == 1 && _accounts.length > 0)
    if (_chainIds.length == 1) {
      let stats = await getNetworkStats(_accounts, _chainIds[0]);
      document.getElementById("gas").innerText = "Gas: ~ " + stats[2] + " gwei";
      document.getElementById("block").innerText = "Block: " + stats[1];
      document.getElementById("network").innerText =
        "Network: " + networks[_chainIds[0]].name;
      document.getElementById("base-name").innerText =
        networks[_chainIds[0]].name;
      document.getElementById("base-bal").innerText =
        stats[0] + " " + networks[_chainIds[0]].token;
    } else {
      document.getElementById("gas").innerText = "";
      document.getElementById("block").innerText = "";
      document.getElementById("network").innerText = "";
      // document.getElementById("base-name").innerText =
      //   "";
      // document.getElementById("base-bal").innerText =
      //   "";
    }
  }
  // /// Logged Out view
  // else if (_accounts.length == 0) {
  //   document.getElementById("gas").innerText = "";
  //   document.getElementById("block").innerText = "";
  //   document.getElementById("network").innerText = "";
  // }
  // /// Multi-Chain viewing, logged in
  // else {
  //   document.getElementById("gas").innerText = "";
  //   document.getElementById("block").innerText = "";
  //   document.getElementById("network").innerText = "Network: Multi Chain";
  // }
};
