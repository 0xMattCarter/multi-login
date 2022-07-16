/// ALL FUNCTIONS FOR USER INFORMATION

submitEmail = async () => {
  let email = document.getElementById("email-input").value; // whats typed in box
  if (email == "" || !email.includes("@") || !loggedIn) {
    return;
  }
  if (confirm("Set " + email + " as your email?") && Moralis.User.current()) {
    try {
      let user = Moralis.User.current();
      await user.set("email", email);
      await user.save();
      await run();
    } catch (error) {
      alert(error);
    }
  } else {
    console.log("denied email submission request");
  }
};

submitUsername = async () => {
  let username = document.getElementById("username-input").value; // whats typed in box
  if (username == "" || !loggedIn) {
    return;
  }
  if (confirm("Set " + username + " as your username?")) {
    try {
      let user = Moralis.User.current();
      await user.set("omni_username", username);
      console.log(user, username);
      await user.save();
      await run();
      document.getElementById("username-input").innerHTML = "";
    } catch (error) {
      alert(error);
    }
  } else {
    console.log("denied username submission request");
  }
};

/// Get all linked accounts (checksummed) for a _user
getUserAccounts = async (_user) => {
  if (_user) {
    let raw = await _user.get("accounts");
    let checksummed = [];
    raw.forEach((r) => {
      checksummed.push(ethers.utils.getAddress(r));
    });
    return checksummed;
  } else {
    return [];
  }
};

/// Function to unlink an account from the user's list of accounts
async function unlink(_account, _user) {
  if (confirm("Remove " + _account + " from your account list?")) {
    await Moralis.unlink(_account);
    console.log(_account + " removed from account list");
    await run();
  }
}

getUserStats = async (_user) => {
  var username, uId, email, links;
  if (!_user) {
    username = "";
    uId = "";
    email = "";
    links = [];
  } else {
    username = await _user.get("omni_username");
    uId = shrinkAddr(_user.id);
    email = await _user.get("email");
    links = await getUserAccounts(_user);

    username = !username ? "Not Set" : username;
    email = !email ? "Not Set" : email;
  }
  return [username, uId, email, links];
};

// resolveENS = async (_addr) => {
//   let res = await Moralis.Web3API.resolve.resolveAddress(_addr);
// };

// reDrawAccountSels = async (_user) => {

// }

setUserStats = async (_user) => {
  let stats = await getUserStats(_user);
  // add event listeners if user
  document.getElementById("user-name").innerText = stats[0];
  document.getElementById("user-id").innerText = stats[1];
  document.getElementById("user-email").innerText = stats[2];

  // links
  document.getElementById("linked-accounts-section").innerHTML = "";
  document.getElementById("account-selector").innerHTML = ""; /// reset addr sels
  // document.getElementById("account-selector").appendChild = ;
  let optB = document.createElement("option");
  optB.value = stats[3][0];
  optB.innerText = shrinkAddr(stats[3][0]);
  document.getElementById("account-selector").appendChild(optB);
  // have to do this for all and primary account
  for (let i = 1; i < stats[3].length; i++) {
    let el = document.createElement("div"),
      addr = document.createElement("div"),
      btn = document.createElement("button");

    addr.innerText = shrinkAddr(stats[3][i]);
    el.classList.add("link"), btn.classList.add("unlink-btn");
    btn.onclick = () => {
      unlink(stats[3][i], _user);
    };
    btn.innerText = "remove";
    el.appendChild(addr), el.appendChild(btn);
    document.getElementById("linked-accounts-section").appendChild(el);

    /// put in sels
    let opt = document.createElement("option");
    opt.value = stats[3][i];
    opt.innerText = shrinkAddr(stats[3][i]);
    document.getElementById("account-selector").appendChild(opt);

    // draw each linkx
  }
  let optA = document.createElement("option");
  optA.value = "all";
  optA.innerText = "All";
  document.getElementById("account-selector").appendChild(optA);

  /// set submit buttons when theres a user
  if (_user) {
    document
      .getElementById("submit-username")
      .addEventListener("click", submitUsername);

    document
      .getElementById("submit-email")
      .addEventListener("click", submitEmail);
  }
};
