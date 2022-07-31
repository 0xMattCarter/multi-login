/// Sets API rate limits
Moralis.settings.setAPIRateLimit({
  anonymous: 1000,
  authenticated: 2000,
  windowMs: 60000,
});

/// Checks if a username is already taken
Moralis.Cloud.define("isUsernameUnique", async (params) => {
  const userQuery = new Moralis.Query(Moralis.User);
  const results = await userQuery.find({ useMasterKey: true });

  for (let i = 0; i < results.length; i++) {
    let res = results[i];
    let thisOne = res.attributes.omni_username;
    let check = params.params.username;

    if (thisOne == check) {
      return false;
    }
  }
  return true;
});
