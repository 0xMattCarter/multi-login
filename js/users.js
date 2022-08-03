/**
 * USER FUNCTIONS
 */

/**
 * Stores a user's email in Moralis DB under 'email'
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
 * Stores a user's username in Moralis DB under 'omni_username'
 */
submitUsername = async () => {
  /// Whats typed in box
  let username = document.getElementById("username-input").value;
  if (username == "" || !loggedIn) {
    return;
  }

  let unique = await Moralis.Cloud.run("isUsernameUnique", {
    username: username,
  });

  if (unique) {
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
  } else {
    alert(`${username} is already taken. Please choose a new username.`);
  }
};

/**
 * Function to manually add new address to user with metamask or walletconnect.
 * Connects to the wallet and uses the default (1st) account selected to link.
 * This means a user will need to change to the account in mm or wc and then superLink
 */
superLink = async (_type) => {
  try {
    /// Reconnect to provider
    await Moralis.enableWeb3({ provider: _type });
    /// Get address to link
    let provider = Moralis.provider;
    let address = "";
    if (_type == "metamask") {
      address = provider.selectedAddress;
    } else if (_type == "walletconnect") {
      address = provider.accounts[0];
    }
    /// Check if the new address is already linked
    let links = await getUserAccounts(Moralis.User.current());
    if (links.includes(ethers.utils.getAddress(address))) {
      alert(
        `This address (${shrinkAddr(
          address
        )}) is already linked to your account`
      );
      return;
    }
    /// Check if any other user's have this address linked
    let copyLower = address.toLowerCase();
    if (await Moralis.Cloud.run("isAccountLinked", { addr: copyLower })) {
      alert(
        `This address (${shrinkAddr(
          address
        )}) is already linked to another account`
      );
      return;
    }
    /// Link the account
    await Moralis.link(address, {
      signingMessage: "Sign this message to link this address to your account",
      provider: _type,
    });
    await setUserStats(Moralis.User.current());
    await run();
  } catch (error) {
    console.log("failed to link address");
  }
};

/**
 * Unlinks an account from a user
 */
unlink = async (_account, _user) => {
  ///
  let links = await getUserAccounts(_user);
  if ((links.length == 1) & (links[0] == _account)) {
    alert("You cannot remove your only address. Please connect another first");
    return;
  } else {
    let og = _user.get("address_groups");
    og = og ? og : {};
    var groups = JSON.parse(JSON.stringify(og)); /// Copies object to new var
    groups ? groups : {};
    var groupsToChange = [];

    for (let group in groups) {
      if (groups[group].includes(_account)) {
        groupsToChange.push(group);
      }
    }
    let msg = "";
    if (groupsToChange.length > 0) {
      msg += "This will effect the following address groups\n\n";
      for (let i = 0; i < groupsToChange.length; i++) {
        msg += groupsToChange[i] + "\n";
      }
    }

    /// Confirm this is ok
    msg = `Are you sure you want to unlink ${shrinkAddr(
      _account
    )} from your account?\n${msg}`;
    if (confirm(msg)) {
      /// Remove account from groups
      await wipeFromAddressGroups([_account], _user);
      /// Remove account from user links
      await Moralis.unlink(_account);
      await setUserStats(_user);
      await run();
    }
  }
};

/**
 * Reads page to get information then
 * adds an address group to a user in Moralis DB under 'address_groups'
 */
makeAddressGroup = async () => {
  let _groupName = document.getElementById("group-input").value;
  let sels = document.getElementsByClassName("group-checker");
  _addresses = [];
  _shortHand = "\n";

  for (let i = 0; i < sels.length; i++) {
    if (sels[i].checked) {
      _addresses.push(sels[i].value);
      _shortHand += shrinkAddr(sels[i].value) + "\n";
    }
  }

  if (confirm("Create " + _groupName + " with:\n" + _shortHand + " ?")) {
    let user = Moralis.User.current();
    if (user) {
      await addToAddressGroup(_addresses, _groupName, user);

      await setUserStats(user);
      await run();
    }
  }
};

/**
 * Adds an array of accounts to a users address group in moralis db, creates the group if it does not exist
 */
addToAddressGroup = async (_addrs, _group, _user) => {
  let dbGroups = _user.get("address_groups");
  dbGroups = dbGroups == undefined ? {} : dbGroups;
  if (dbGroups[_group]) {
    for (let i = 0; i < _addrs.length; i++) {
      if (!dbGroups[_group].includes(_addrs[i])) {
        dbGroups[_group].push(_addrs[i]);
      }
    }
  } else {
    dbGroups[_group] = _addrs;
  }

  await _user.set("address_groups", dbGroups);
  await _user.save();
};

/**
 * Removes an array of accounts from a users address group in moralis db if the group exists
 */
removeFromAddressGroup = async (_addrs, _group, _user) => {
  let dbGroups = _user.get("address_groups");
  if (dbGroups[_group]) {
    for (let i = 0; i < _addrs.length; i++) {
      if (dbGroups[_group].includes(_addrs[i])) {
        dbGroups[_group].splice(dbGroups[_group].indexOf(_addrs[i]), 1);
      }
    }
  } else {
    console.log("no groups with that name");
  }

  await _user.set("address_groups", dbGroups);
  await _user.save();
};

/**
 * Removes an array of addresses from each address group that contains it
 * This is used when a user unlinks an address and needs to wipe it from each group
 */
wipeFromAddressGroups = async (_addrs, _user) => {
  let dbGroups = _user.get("address_groups");
  for (let i in _addrs) {
    let addr = _addrs[i];
    for (let group in dbGroups) {
      if (dbGroups[group].includes(addr)) {
        dbGroups[group].splice(dbGroups[group].indexOf(addr), 1);
      }
    }
  }
  await _user.set("address_groups", dbGroups);
  await _user.save();
};

/**
 * Removes an address group from a user
 */
removeAddressGroup = async (_groupName, _addrs) => {
  let _shortHand = "\n";
  for (let i = 0; i < _addrs.length; i++) {
    _shortHand += shrinkAddr(_addrs[i]) + "\n";
  }
  if (confirm("Remove " + _groupName + " with " + _shortHand + " ?")) {
    let user = Moralis.User.current();
    let groups = await user.get("address_groups");
    if (groups == undefined) {
      groups = {};
    }
    try {
      delete groups[_groupName];
      await user.set("address_groups", groups);
      await user.save();
      await setUserStats(user);
      await run();
    } catch (error) {
      console.log(
        "failed to delete this group, are you sure it exists ?",
        error
      );
    }
  }
};

/**
 * Adds a contract address to a user's hidden tokens in Moralis DB
 * under 'hidden_tokens'
 */
hideContract = async (_address) => {
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

/**
 * Removes a contract address from a users' hidden tokens
 */
unhideContract = async (_address) => {
  if (confirm("Un-hide tokens from this contract address?\n" + _address)) {
    let user = Moralis.User.current();
    let hidden = await user.get("hidden_tokens");
    if (hidden == undefined) {
      hideen = [];
    }
    try {
      let i = hidden.indexOf(_address);
      hidden.splice(i, 1);
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
 * Get all user's linked accounts in proper format (checksummed)
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
 * Gets a user's: username, userId, email, linked addresses, and address groups
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
      (groups = await _user.get("address_groups")),
      /// Set defaults if not set
      (username = !username ? "Not Set" : username);
    email = !email ? "Not Set" : email;
    links = !links ? [] : links;
    groups = !groups ? {} : groups;
  }
  return {
    username: username,
    uId: uId,
    email: email,
    links: links,
    groups: groups,
  };
};

/**
 * Sets a user's: username, userId, email, linked addresses, and address groups
 */
setUserStats = async (_user) => {
  console.log("setting user details");
  /// Stats getter call
  let stats = await getUserStats(_user);
  /// Set username, userId, email
  document.getElementById("user-name").innerText = stats.username;
  document.getElementById("user-id").innerText = stats.uId;
  document.getElementById("user-email").innerText = stats.email;
  /// Wipe linked accounts
  document.getElementById("linked-accounts-section").innerHTML = "";
  /// Wipe linked accounts selector choices
  document.getElementById("account-selector").innerHTML = "";
  /// Wipe address groups
  document.getElementById("account-groups-section").innerHTML = "";

  let links = stats.links;

  let groups = stats.groups;

  if (links[0] != undefined) {
    if (links[0].length > 1) {
      document.getElementById("create-group-btn").onclick = makeAddressGroup;
    }
    /// Reorder links to have the default address first
    let def = ethers.utils.getAddress(_user.get("ethAddress"));
    let ind = links.indexOf(def);
    let copy = links[0];
    links[ind] = copy;
    links[0] = def;
  } else {
    links = [];
  }
  for (let i = 0; i < links.length; i++) {
    /// Draw each linked account
    let el = document.createElement("div"), /// main element
      addr = document.createElement("div"), /// link address
      btn = document.createElement("button"), /// link btn
      dd = document.createElement("div"), /// link btn container element
      dd1 = document.createElement("label"), /// add to group label
      dd2 = document.createElement("input"), /// checkbox
      opt = document.createElement("option"); /// address selector

    el.classList.add("link");
    btn.classList.add("unlink-btn");
    dd2.classList.add("group-checker");

    dd1.innerText = "Add to group";
    addr.innerText = shrinkAddr(links[i]);
    btn.innerText = "remove";
    opt.innerText = shrinkAddr(links[i]);

    dd2.type = "checkbox";
    dd2.name = "Group" + i + 1;

    dd2.value = links[i];
    opt.value = links[i];

    btn.onclick = () => {
      unlink(links[i], _user);
    };

    dd.appendChild(dd2),
      dd.appendChild(dd1),
      el.appendChild(addr),
      el.appendChild(btn),
      el.appendChild(dd);

    document.getElementById("linked-accounts-section").appendChild(el);
    document.getElementById("account-selector").appendChild(opt);
  }

  for (let g in groups) {
    var txt = "";
    let _addrs = groups[g], // list of addresses in group
      theG = document.createElement("div"), // the group element
      g1 = document.createElement("div"), // group name
      g2 = document.createElement("button"), // remove btn
      g3 = document.createElement("div"), // shrunk addresses
      opt = document.createElement("option"); // group option selector

    theG.classList.add("group"),
      g1.classList.add("g"),
      g2.classList.add("g1"),
      g2.classList.add("unlink-btn"),
      g3.classList.add("g2");

    g2.onclick = async () => {
      removeAddressGroup(g, _addrs);
    };

    for (let j = 0; j < _addrs.length; j++) {
      j == _addrs.length - 1
        ? (txt += shrinkAddr(_addrs[j]))
        : (txt += shrinkAddr(_addrs[j]) + ", ");
    }

    opt.value = _addrs;

    g1.innerText = g;
    g2.innerText = "remove";
    g3.innerText = txt;
    opt.innerText = g;

    theG.appendChild(g1), theG.appendChild(g2), theG.appendChild(g3);

    document.getElementById("account-groups-section").appendChild(theG);
    document.getElementById("account-selector").appendChild(opt);
  }
  /// Add "all" option for account selctors
  let optA = document.createElement("option");
  (optA.value = "all"), (optA.innerText = "All");
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
