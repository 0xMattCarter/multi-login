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
 * Function to get _chainId's current block, current gas price,
 * and user's balance
 */
getNetworkStats = async (_accounts, _chainId) => {
  if (_accounts.length == 0) {
    return ["", "", ""];
  } else {
    let bal = 9999.0;
    let block = "99999";
    let gwei = "420";
    bal = await getNetworkBalances(_accounts, _chainId);
    let prov = providers[_chainId];
    block = await prov.getBlockNumber();
    let wei = await prov.getGasPrice();
    gwei = parseInt(ethers.utils.formatUnits(wei, 9));
    return [bal.toFixed(3), block, gwei];
  }
};

/**
 * Function to set network stats for an array of _chainIds.
 * Sets _accounts( [] ) cummulative network balance,
 * current block, & current gas price
 */
setNetworkStats = async (_accounts, _chainIds) => {
  /// Single chain viewing, logged in
  if (_chainIds.length == 1 && _accounts.length > 0) {
    let stats = await getNetworkStats(_accounts, _chainIds[0]);
    document.getElementById("gas").innerText = "Gas: ~ " + stats[2] + " gwei";
    document.getElementById("block").innerText = "Block: " + stats[1];
    document.getElementById("network").innerText =
      "Network: " + networks[_chainIds[0]].name;
    document.getElementById("base-name").innerText =
      networks[_chainIds[0]].name;
    document.getElementById("base-bal").innerText =
      stats[0] + " " + networks[_chainIds[0]].token;
  }
  /// Logged Out view
  else if (_accounts.length == 0) {
    document.getElementById("gas").innerText = "";
    document.getElementById("block").innerText = "";
    document.getElementById("network").innerText = "";
    document.getElementById("network-bal").innerText = "";
  }
  /// Multi-Chain viewing, logged in
  else {
    document.getElementById("gas").innerText = "Gas: ~ xyz gwei";
    document.getElementById("block").innerText = "Block: 1234567";
    document.getElementById("network").innerText = "Network: Multi Chain";
    document.getElementById("network-bal").innerText =
      "Balance: figure this out";
  }
};
