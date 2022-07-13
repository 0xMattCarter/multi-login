/**
 * Shrinks address to 0xabcd...1234 format
 */
function shrinkAddr(_addr) {
  return (
    _addr.substring(0, 6) +
    "..." +
    _addr.substring(_addr.length - 4, _addr.length)
  );
}

/**
 * Sets account metrics
 */
async function setPortfolio(_account) {
  let v = document.getElementById("checker");
  let myAcc = document.getElementById("wallet1");
  let myId = document.getElementById("wallet2");
  let myEmail = document.getElementById("current-email");
  let myLinks = document.getElementById("linked-wallets");

  var _myId = "-";
  var _myEmail = "Not Set";
  // var _myLinks = ""
  if (_account != "") {
    v.style.visibility = "visible";
    let user = Moralis.User.current(); // current user
    let accs = await user.get("accounts");
    let allAccs = [_account];
    _myId = shrinkAddr(user.id);
    _myEmail = await user.get("email");
    if (!_myEmail) {
      _myEmail = "Not Set";
    }
    document
      .getElementById("submit-email")
      .addEventListener("click", submitEmail);
    myId.innerText = "User Id: " + _myId; // shrunk user id
    myEmail.innerText = "Current Email: " + _myEmail;
    myLinks.innerHTML = "";
    for (let i = 0; i < accs.length; i++) {
      let thisAcc = ethers.utils.getAddress(accs[i]);
      /// non-primary addrs
      if (thisAcc != _account) {
        allAccs.push(thisAcc);
        let d = document.createElement("div");
        let el = document.createElement("p");
        let btn = document.createElement("button");
        d.appendChild(el);
        d.appendChild(btn);
        myLinks.appendChild(d);
        d.classList.add("linked");
        el.innerText = thisAcc;
        btn.innerText = "Remove";
        btn.onclick = function () {
          unlink(thisAcc);
        };
      }
    }
    await setNetworkStats(allAccs);
  } else {
    v.style.visibility = "hidden";
    myLinks.innerHTML = "";
    myAcc.innerText = "Connected Account: " + _myAcc; // shrunk eth addr
    myId.innerText = "User Id: " + _myId; // shrunk user id
    myEmail.innerText = _myEmail;
  }

  // console.log("setting portfolio");
  // document.getElementById("linked-wallets").innerHTML = ""; // wipes linked-wallets container
  // var wallet1 = "Not Connected";
  // var wallet2 = "-";
  // var chain = "0x0";
  // var balance = "0";
  // var gas = "0";
  // var block = "0";
  // var email = "";
  /// only if logged in and theres an account
  // if (account != "") {
  // linked accounts (in moralis)
  /// iterates through all linked eth accounts
  // for (let i = 0; i < accs.length; i++) {
  //   let thisAcc = ethers.utils.getAddress(accs[i]);
  //   /// non-primary addrs
  //   if (thisAcc != account) {
  //     /// html set up
  //     let d = document.createElement("div");
  //     let el = document.createElement("p");
  //     let btn = document.createElement("button");
  //     d.classList.add("linked");
  //     el.innerText = thisAcc;
  //     btn.innerText = "Remove";
  //     btn.onclick = function () {
  //       unlink(thisAcc);
  //     };
  //     d.appendChild(el);
  //     d.appendChild(btn);
  //     document.getElementById("linked-wallets").appendChild(d);
  //   }
  // }

  /// set all html text
  // document.getElementById("wallet1").innerText =
  //   "Connected Account: " + wallet1;
  // document.getElementById("wallet2").innerText = "User Id: " + wallet2;
  // document.getElementById("chain").innerText = "Chain: " + networks[chain].name;
  // document.getElementById("block").innerText = "Block: " + block;
  // document.getElementById("gas-price").innerText =
  //   "Gas Price: " + parseInt(gas) + " gwei";
  // document.getElementById("balance").innerText =
  //   "Balance: " + parseFloat(balance).toFixed(4) + " " + networks[chain].token;
  // document.getElementById("current-email").innerText =
  //   "Current Email: " + email;
}

/**
 * Function to submit user's email to moralis db
 */
async function submitEmail() {
  let email = document.getElementById("email-input").value; // whats typed in box
  if (confirm("Set " + email + " as your email?")) {
    try {
      let user = Moralis.User.current();
      await user.set("email", email);
      await user.save();
      await run(ethers.utils.getAddress(Moralis.account));
    } catch (error) {
      alert(error);
    }
  } else {
    console.log("denied email submission request");
  }
}

/**
 * Function to get all network balances (in base currency)
 */
async function getNetworkBalances(_account) {
  balances = [];
  for (prov of Object.entries(providers)) {
    let bal = ethers.utils.formatUnits(await prov[1].getBalance(_account), 18);
    balances.push(bal);
    // console.log(prov, prov[1]);
  }
  return balances;
}

/**
 * Function to set each network stat box
 */
async function setNetworkStats(_accs) {
  let nets = document.getElementById("nets");
  nets.innerHTML = "";
  for (prov of Object.entries(providers)) {
    let bal = 0.0;
    /// non-primary addrs
    for (let i = 0; i < _accs.length; i++) {
      newBal = parseFloat(
        ethers.utils.formatUnits(await prov[1].getBalance(_accs[i]), 18)
      );
      bal += newBal;
    }
    let box = document.createElement("div");
    let ntk = document.createElement("h2");
    let blk = document.createElement("h2");
    let gs = document.createElement("h2");
    let bln = document.createElement("h2");
    box.classList.add("net-box");
    box.appendChild(ntk);
    box.appendChild(blk);
    box.appendChild(gs);
    box.appendChild(bln);
    ntk.innerText = networks["0x" + prov[1]._network.chainId.toString(16)].name;
    blk.innerText = "Current Block: " + (await prov[1].getBlock()).number;
    gs.innerText =
      "Gas: ~ " +
      parseInt(await ethers.utils.formatUnits(await prov[1].getGasPrice(), 9)) +
      " gwei";
    bln.innerText =
      "Network Balances: " +
      bal.toFixed(3) +
      networks["0x" + prov[1]._network.chainId.toString(16)].token;

    nets.appendChild(box);
  }
}
