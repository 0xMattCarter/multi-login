/// ALL FUNCTIONS FOR USER INFORMATION

/**
 * Function to store an email in Moralis for a user
 */
submitEmail = async () => {
  /// Whats typed in email box
  let email = document.getElementById("email-input").value;
  /// Basic format check
  if (email == "" || !email.includes("@") || !loggedIn) {
    return;
  }
  /// Confirm email
  if (confirm("Set " + email + " as your email?") && Moralis.User.current()) {
    try {
      let user = Moralis.User.current();
      await user.set("email", email);
      await user.save();
      /// Display new email
      await setUserStats(user);
    } catch (error) {
      alert(error);
    }
  } else {
    console.log("denied email submission request");
  }
};

/**
 * Function to store a username in Moralis for a user
 */
submitUsername = async () => {
  /// Whats typed in box
  let username = document.getElementById("username-input").value;
  if (username == "" || !loggedIn) {
    return;
  }
  /// Confirm username
  if (confirm("Set " + username + " as your username?")) {
    try {
      let user = Moralis.User.current();
      await user.set("omni_username", username);
      await user.save();
      /// Display new username
      await setUserStats(user);
      document.getElementById("username-input").innerHTML = "";
    } catch (error) {
      alert(error);
    }
  } else {
    console.log("denied username submission request");
  }
};

/**
 * Function to get all linked accounts of _user
 * NOTE all of these addrs are checksummed
 */
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

/**
 * Adds a contract address to a user's hidden list
 * Erc20s and Erc1155s
 */

hideContract = async (_address) => {
  ///
  if (confirm("Hide tokens from this contract address?\n" + _address)) {
    let user = Moralis.User.current();
    let hidden = await user.get("hidden_tokens");
    if (hidden == undefined) {
      // no hides yet
      hidden = [];
    }
    hidden.push(_address);
    await user.set("hidden_tokens", hidden);
    await user.save();
    await run();
  }
};

makeAddressGroup = async () => {
  let _groupName = document.getElementById("group-input").value;
  let sels = document.getElementsByClassName("group-checker");
  _addresses = [];
  console.log(sels, sels.length);

  for (let i = 0; i < sels.length; i++) {
    if (sels[i].checked) {
      _addresses.push(sels[i].value);
    }
  }
  console.log(_addresses);
  // console.log(gName, sels);

  if (confirm("Create " + _groupName + " with:\n" + _addresses + " ?")) {
    let user = Moralis.User.current();
    let groups = await user.get("address_groups");
    if (groups == undefined) {
      groups = {};
    }
    groups[_groupName] = _addresses;
    await user.set("address_groups", groups);
    await user.save();
    await setUserStats(user);
    await run();
  }
};

removeAddressGroup = async (_groupName, _addrs) => {
  if (confirm("Remove " + _groupName + " with " + _addrs + " ?")) {
    let user = Moralis.User.current();
    let groups = await user.get("address_groups");
    if (groups == undefined) {
      groups = {};
    }
    try {
      console.log(groups);
      delete groups[_groupName];
      console.log("after delete", groups);
      await user.set("address_groups", groups);
      await user.save();
      await setUserStats(user);
      await run();
      console.log(groups);
    } catch (error) {
      console.log(groups, _groupName, groups[_groupName]);
      console.log(
        "failed to delete this group, are you sure it exists ?",
        error
      );
    }
  }
};

unhideContract = async (_address) => {
  if (confirm("Un-hide tokens from this contract address?\n" + _address)) {
    let user = Moralis.User.current();
    let hidden = await user.get("hidden_tokens");
    try {
      let i = hidden.indexOf(_address);
      console.log(i, hidden);
      hidden.splice(i, 1);
      console.log(i, hidden);
      await user.set("hidden_tokens", hidden);
      await user.save();
      await run();
    } catch (error) {
      console.log(
        "failed to unhide this contract, are you sure it is already hidden"
      );
    }
  }
};

/**
 * Function to remove _accounts from _user's account list
 */
unlink = async (_account, _user) => {
  if (confirm("Remove " + _account + " from your account list?")) {
    await Moralis.unlink(_account);
    console.log(_account + " removed from account list");
    await setUserStats(Moralis.User.current());
    await run();
    // set network stats again
  }
};

/**
 * Function to link an account to a user
 */
link = async (_account) => {
  if (confirm("Add " + _account + " to your account list?")) {
    try {
      await Moralis.link(_account);
      await Moralis.enableWeb3();
      document.getElementById("possible-link").innerHTML = "";
      await run();
    } catch (error) {
      alert(
        "There was an error linking this address to your account. It may already have an account with us."
      );
      console.log(error);
      document.getElementById("possible-link").innerHTML = "";
    }

    console.log(_account + " added to account list");
    await setUserStats(Moralis.User.current());
    await run();
  }
};

/**
 * Function to get a user's stats. Username, email, userId, links
 */
getUserStats = async (_user) => {
  var username, uId, email, links, groups;
  if (!_user) {
    (username = ""), (uId = ""), (email = ""), (links = []), (groups = {});
  } else {
    (username = await _user.get("omni_username")),
      (uId = shrinkAddr(_user.id)),
      (email = await _user.get("email")),
      (links = await getUserAccounts(_user)),
      (groups = await _user.get("address_groups"));
    /// Set defaults if not set
    username = !username ? "Not Set" : username;
    email = !email ? "Not Set" : email;
    groups = !groups ? {} : groups;
  }
  return [username, uId, email, links, groups];
};

/**
 * Function to set a _user's stats. Username, userId, emmail, links
 */
setUserStats = async (_user) => {
  console.log("setting user details");
  /// Stats getter call
  let stats = await getUserStats(_user);
  /// Set username, userId, email
  document.getElementById("user-name").innerText = stats[0];
  document.getElementById("user-id").innerText = stats[1];
  document.getElementById("user-email").innerText = stats[2];
  /// Wipe linked accounts
  document.getElementById("linked-accounts-section").innerHTML = "";
  /// Wipe linked accounts selector choices
  document.getElementById("account-selector").innerHTML = "";
  let links = stats[3];
  let groups = stats[4];

  /// Adds default address to selector options, but skips in for loop
  /// this is to skip adding the default addr to the linked addr section
  if (links[0] != undefined) {
    if (links[0].length > 1) {
      document.getElementById("create-group-btn").onclick = makeAddressGroup;
    }
    /// Reorder links to have the default address first
    let def = ethers.utils.getAddress(Moralis.account);
    let ind = links.indexOf(def);
    let copy = links[0];
    links[ind] = copy;
    links[0] = def;
    /// Create html
    // let optB = document.createElement("option");
    // optB.value = links[0];
    // optB.innerText = shrinkAddr(links[0]);
    // document.getElementById("account-selector").appendChild(optB);
  }
  for (let i = 0; i < links.length; i++) {
    /// Draw each linked account
    let el = document.createElement("div"),
      addr = document.createElement("div"),
      btn = document.createElement("button");
    let dd = document.createElement("div"),
      dd1 = document.createElement("label"),
      dd2 = document.createElement("input");
    dd1.innerText = "Add to group";
    dd2.classList.add("group-checker"),
      (dd2.type = "checkbox"),
      (dd2.name = "Group" + i + 1),
      (dd2.value = links[i]);
    dd.appendChild(dd2);
    dd.appendChild(dd1);
    addr.innerText = shrinkAddr(links[i]);
    btn.innerText = "remove";
    el.classList.add("link"), btn.classList.add("unlink-btn");
    btn.onclick = () => {
      unlink(links[i], _user);
    };
    el.appendChild(addr), el.appendChild(btn), el.appendChild(dd);
    document.getElementById("linked-accounts-section").appendChild(el);
    /// Draw each linked account selector
    let opt = document.createElement("option");
    opt.value = links[i];
    opt.innerText = shrinkAddr(links[i]);
    document.getElementById("account-selector").appendChild(opt);
  }
  /// Draw "All" option for account selector choices
  document.getElementById("account-groups-section").innerHTML = "";
  for (let g in groups) {
    let _addrs = groups[g];
    let theG = document.createElement("div"),
      g1 = document.createElement("div"),
      g2 = document.createElement("button"),
      g3 = document.createElement("div");

    theG.classList.add("group"),
      g1.classList.add("g"),
      g2.classList.add("g1"),
      g2.classList.add("unlink-btn"),
      g3.classList.add("g2");

    g1.innerText = g;
    g2.innerText = "remove";

    g2.onclick = async () => {
      removeAddressGroup(g, _addrs);
    };
    let txt = "";

    for (let j = 0; j < _addrs.length; j++) {
      if (j == _addrs.length - 1) {
        txt += shrinkAddr(_addrs[j]);
      } else {
        txt += shrinkAddr(_addrs[j]) + ", ";
      }
    }
    g3.innerText = txt;

    theG.appendChild(g1);
    theG.appendChild(g2);
    theG.appendChild(g3);
    document.getElementById("account-groups-section").appendChild(theG);
    // add this group to account-sels
    let opt = document.createElement("option");
    opt.value = _addrs;
    console.log(_addrs, opt.value);

    opt.innerText = g;
    document.getElementById("account-selector").appendChild(opt);
  }
  /// ********************* add all groups here as well
  let optA = document.createElement("option");
  optA.value = "all";
  optA.innerText = "All";
  document.getElementById("account-selector").appendChild(optA);
  /// Set submit buttons when theres a user
  if (_user) {
    document
      .getElementById("submit-username")
      .addEventListener("click", submitUsername),
      document
        .getElementById("submit-email")
        .addEventListener("click", submitEmail);
  }
};
