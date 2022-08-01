# web3login

moralis login
by Matt1

# Moralis Cloud Code

Moralis gives the option to store specific functions in the cloud to run. This allows the cloud to handle database security for reading information.
Cloud code can be found in the ./cloud/ directory.

## Updating Cloud Code

- `npm install -g moralis-admin-cli`
- `moralis-admin-cli watch-cloud-folder --moralisApiKey {moralis api key} --moralisApiSecret {moralis api secret} --moralisSubdomain pz3ac4aydbjr.usemoralis.com --autoSave 1 --moralisCloudfolder web3login/cloud`
