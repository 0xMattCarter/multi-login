/**
 * NETWORK FUNCTIONS
 */

/**
 * Gets a netowork's current blocko and avg gas price (in gwei)
 */
getNetworkStats = async (_accounts, _chainId) => {
  let obj = { block: "", gas: "" };
  if (_accounts.length > 0) {
    let prov = providers[_chainId];
    obj.block = await prov.getBlockNumber();
    obj.gas = parseInt(ethers.utils.formatUnits(await prov.getGasPrice(), 9));
  }
  return obj;
};

/**
 * Set the network stats for an array of chainIds
 */
setNetworkStats = async (_accounts, _chainIds) => {
  /// Logged out
  if (Moralis.User.current()) {
    /// Single Chain
    if (_chainIds.length == 1) {
      let stats = await getNetworkStats(_accounts, _chainIds[0]);
      document.getElementById("gas").innerText = `Gas: ~ ${stats.gas} gwei`;
      document.getElementById("block").innerText = `Block: ${stats.block}`;
      document.getElementById("network").innerText =
        "Network: " + networks[_chainIds[0]].name;
    }
    /// Multi Chain
    else {
      document.getElementById("gas").innerText = "";
      document.getElementById("block").innerText = "";
      document.getElementById("network").innerText = "";
    }
  }
  /// Logged in
  else {
    document.getElementById("gas").innerText = "";
    document.getElementById("block").innerText = "";
    document.getElementById("network").innerText = "";
  }
};
