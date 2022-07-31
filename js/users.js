/**
 * USER FUNCTIONS
 * email, username, linked accounts,
 * address groups, hidden contracts
 */

/// Store a user's email in Moralis
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

/// Store a user's username in Moralis
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

/// Adds an account to a user's linked accounts in Moralis
link = async (_account) => {
  if (confirm("Add " + _account + " to your account list?")) {
    try {
      await Moralis.link(_account);
      await Moralis.enableWeb3();
      document.getElementById("possible-link").innerHTML = "";
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

/// Removes an account from a user's linked accounts in Moralis
unlink = async (_account, _user) => {
  if (confirm("Remove " + _account + " from your account list?")) {
    await Moralis.unlink(_account);
    console.log(_account + " removed from account list");
    await setUserStats(Moralis.User.current());
    await run();
    // set network stats again
  }
};

/// Adds contract address to hide tokens from for a user in Moralis
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

/// Removes contract address to hide tokens from for a user in Moralis
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

/// Stores a group of addresses for a user in Moralis
makeAddressGroup = async () => {
  let _groupName = document.getElementById("group-input").value;
  let sels = document.getElementsByClassName("group-checker");
  _addresses = [];

  for (let i = 0; i < sels.length; i++) {
    if (sels[i].checked) {
      _addresses.push(sels[i].value);
    }
  }

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

/// Removes a group of addresses for a user in Moralis
removeAddressGroup = async (_groupName, _addrs) => {
  if (confirm("Remove " + _groupName + " with " + _addrs + " ?")) {
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

/// Get all user's linked accounts
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

/// Gets a user's: username, userId, email, linked accounts, and address groups
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
  return {
    username: username,
    uId: uId,
    email: email,
    links: links,
    groups: groups,
  };
  // return [username, uId, email, links, groups];
};

/// Sets a _user's: username, userId, email, links, groups
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
