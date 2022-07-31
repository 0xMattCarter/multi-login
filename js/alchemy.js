/**
 * ALCHEMY API FUNCTIONS
 * not usded currently
 */

const ethAlchemyKey = "";
const polygonAlchemyKey = "uipyG-";

const alchemyParams = {
  "0x1": `https://eth-mainnet.alchemyapi.io/nft/v2/${ethAlchemyKey}`,
  "0x89": `https://polygon-mainnet.g.alchemy.com/v2/${polygonAlchemyKey}`,
};

/**
 * Gets metadata for an nft on eth mainnet
 * _cAddr NFT Contract address
 * _tId NFT TokenId
 */
alchemyNFTMeta = async (_cAddr, _tId, _cId) => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const baseURL = `https://eth-mainnet.alchemyapi.io/nft/v2/oim9AGHzvQ5tY07qXcwQK2R2OmQNwtnP/getNFTMetadata`;
  const contractAddr = _cAddr;
  const tokenId = _tId;
  const fetchURL = `${baseURL}?contractAddress=${contractAddr}&tokenId=${tokenId}`;
  let metadata = {};

  try {
    metadata = await (await fetch(fetchURL, requestOptions)).json();
  } catch (error) {
    metadata = {};
  }
  return metadata;
};

/**
 * Gets NFTs for an array of accounts
 * Valid _cIds are "0x1" & "0x89"
 */
alchemyAccountNfts = async (_accounts, _cId) => {
  const requestOptions = {
      method: "GET",
      redirect: "follow",
    },
    baseURL = `${alchemyParams[_cId]}/getNFTs/`;

  var nfts = [],
    erc721s = [],
    erc1155s = [],
    erc1155Bals = {};

  /// Iterate over each _account
  for (let j = 0; j < _accounts.length; j++) {
    var fetchURL = `${baseURL}?owner=${_accounts[j]}&$filters=["SPAM"]`;
    let t = await (await fetch(fetchURL, requestOptions)).json();
    /// Iterate through first batch
    t.ownedNfts.forEach((nft) => {
      /// NFT Type
      if (nft.id.tokenMetadata.tokenType == "ERC721") {
        erc721s.push(nft);
      } else if (nft.id.tokenMetadata.tokenType == "ERC1155") {
        /// Sum balances for identical tokens
        if (!erc1155Bals[nft.contract.address + nft.id.tokenId]) {
          erc1155Bals[nft.contract.address + nft.id.tokenId] = parseInt(
            nft.balance
          );
          erc1155s.push(nft);
        } else {
          erc1155Bals[nft.contract.address + nft.id.tokenId] += parseInt(
            nft.balance
          );
        }
      }
    });
    /// Get ALL nfts
    for (let i = 1; i < Math.ceil(t.totalCount / 100); i++) {
      fetchURL = `${baseURL}?owner=${_accounts[j]}&filters=[SPAM]&pageKey=${t.pageKey}`;
      t = await (await fetch(fetchURL, requestOptions)).json();
      t.ownedNfts.forEach((nft) => {
        /// NFT Type
        if (nft.id.tokenMetadata.tokenType == "ERC721") {
          erc721s.push(nft);
        } else if (nft.id.tokenMetadata.tokenType == "ERC1155") {
          /// Sum balances for identical tokens
          if (!erc1155Bals[nft.contract.address + nft.id.tokenId]) {
            erc1155Bals[nft.contract.address + nft.id.tokenId] = nft.balance;
            erc1155s.push(nft);
          } else {
            erc1155Bals[nft.contract.address + nft.id.tokenId] += nft.balance;
          }
        }
      });
    }
  }

  console.log(erc721s, erc1155s, erc1155Bals);
  //   console.log(t);
  //   while (count >= 100) {
  //     console.log(t);
  //     pageKey = t.pageKey;
  //     fetchURL = `${baseURL}?owner=${ownerAddr}&pageKey=${pageKey}`;
  //     t = await (await fetch(fetchURL, requestOptions)).json();
  //     console.log(t);
  //   }
};
