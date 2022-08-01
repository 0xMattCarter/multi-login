/**
 * UTILITY FUNCTIONS
 */

/**
 * Converts a decimal tokenId into the 64 0s padded json format
 * (for 1155 token that contain {id} in their URIs)
 */
tokenToJson = (tokenId) => {
  let dec = ethers.BigNumber.from(tokenId);
  let hex = dec.toHexString();
  let pad = 64 - hex.length + 2;
  let padded = "";
  for (let i = 0; i < pad; i++) {
    padded += "0";
  }
  padded += hex.substring(2);
  return padded;
};

/**
 * Shrinks an an address to 0xabcd...1234 format
 */
shrinkAddr = (_addr) => {
  return (
    _addr.substring(0, 6) +
    "..." +
    _addr.substring(_addr.length - 4, _addr.length)
  );
};

/**
 * Returns a contract instance using ethers.js
 */
getContractInstance = (_addr, _abi, _chainId) => {
  return new ethers.Contract(_addr, _abi, providers[_chainId]);
};
