/**
 * NETWORK FUNCTIONS
 */

/// Gets a network's current block and gas price
getNetworkStats = async (_accounts, _chainId) => {
  let obj = { block: "", gas: "" };
  if (_accounts.length > 0) {
    let prov = providers[_chainId];
    obj.block = await prov.getBlockNumber();
    obj.gas = parseInt(ethers.utils.formatUnits(await prov.getGasPrice(), 9));
  }
  return obj;
};

/// Sets network stats for an array of _chainIds
setNetworkStats = async (_accounts, _chainIds) => {
  if (!Moralis.User.current()) {
    console.log("bitch");
    document.getElementById("gas").innerText = "";
    document.getElementById("block").innerText = "";
    document.getElementById("network").innerText = "";
  }
  /// Logged in
  else {
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
};
