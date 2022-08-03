/**
 * Moralis Cloud Code
 * These functions run in the cloud, not on the client's side
 * After changes made (or while changes are being made), run:
 * npm install -g moralis-admin-cli
 * moralis-admin-cli watch-cloud-folder --moralisApiKey {moralis api key} --moralisApiSecret {moralis api secret} --moralisSubdomain pz3ac4aydbjr.usemoralis.com --autoSave 1 --moralisCloudfolder web3login/cloud
 */

/**
 * Sets API rate limits
 */
Moralis.settings.setAPIRateLimit({
  anonymous: 100,
  authenticated: 250,
  windowMs: 60000,
});

/**
 * Checks DB to see if potential username is taken
 */
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

/**
 * Checks DB to see if potential address is already linked to any users
 * Addr must be lowercase (not checksummed)
 */
Moralis.Cloud.define("isAccountLinked", async (params) => {
  const userQuery = new Moralis.Query("User");
  const results = await userQuery.find({ useMasterKey: true });
  let ret = false;

  for (let i = 0; i < results.length; i++) {
    let res = results[i];
    let accountArrays = res.attributes.accounts;
    /// See if addr is found
    if (accountArrays) {
      if (accountArrays.includes(params.params.addr)) {
        return true;
      }
    }
  }
  return false;
});
