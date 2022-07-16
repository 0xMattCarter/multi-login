/// ALL FUNCTIONS THAT DEAL WITH NETWORK/CHAIN THINGS

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

    // let prov = providers[_chainId];
    // let block = await prov.getBlockNumber();
    // let wei = await prov.getGasPrice();
    // let gwei = parseInt(ethers.utils.formatUnits(wei, 9));
    return [bal.toFixed(3), block, gwei];
  }
};

setNetworkStats = async (_accounts, _chainId) => {
  //   let stats = await getNetworkStats(_accounts, _chainId);
  //   document.getElementById("gas").innerText = "Gas: ~ " + stats[2] + " gwei";
  //   document.getElementById("block").innerText = "Block: " + stats[1];

  if (_chainId.length == 1) {
    let stats = await getNetworkStats(_accounts, _chainId[0]);
    document.getElementById("gas").innerText = "Gas: ~ " + stats[2] + " gwei";
    document.getElementById("block").innerText = "Block: " + stats[1];
    document.getElementById("network").innerText =
      "Network: " + networks[_chainId[0]].name;
    document.getElementById("network-bal").innerText =
      "Balance: " + stats[0] + networks[_chainId[0]].token;
  } else {
    document.getElementById("gas").innerText = "Gas: ~ xyz gwei";
    document.getElementById("block").innerText = "Block: 1234567";
    document.getElementById("network").innerText = "Network: Multi Chain";
    document.getElementById("network-bal").innerText =
      "Balance: figure this out";
  }
};

//// NEXT: users.js => user.id, linking, email, user.get/set/saves
