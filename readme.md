## ECDSA Node

Using [Alchemy's](https://www.alchemy.com/) [alchemyplatform/ecdsa-node](https://github.com/alchemyplatform/ecdsa-node) repo as a starting point, this project demonstrates how a simple hypothetical ECDSA Node could be implemented. Extending the original project's work by implementing noncing and digital signing of transactions means that illegitimate transfers are essentially prevented.

Entering valid EVM format addresses for the sender's wallet and transaction recipient together with a positive integer amount into the client [React](https://reactjs.org/) app results in a JSON transaction message being presented to the user. By signing this JSON offline, entering the resulting full signature into the client React app and clicking the 'Transfer' button, the transaction is submitted to the [Express](https://expressjs.com/) [node.js](https://nodejs.org/) server app. The server then accepts or rejects the transaction.

In this project, each sender's address is associated with an incrementing nonce number in order to prevent transaction replay attacks. Both the sender and recipient addresses and the full signature entered into the React client app should be of the form 0x followed by hex characters to be accepted. The full signature's final character should be the recovery bit.

Restarting the Express server app will reset all addresses, balances and nonces to their initital state.

For the sake of demonstration, only three EVM addresses have balances when the Express server is started. These are:

1. 0x7136dbf5c587f3a529a91d05c36d7957f41dd57b
2. 0xfcad0b19bb29d4674531d6f115237e16afce377c
3. 0xb1de725ac0edcba357ec1fb72a637ef6e9dad4fc

Those addresses correspond to the following fictitious private keys:

1. 0x66151edf52b803824512949cfcdad4059bbbba1f4f7af6c671e4141c0e717aa0
2. 0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
3. 0x8297a57ca431ec2a05d9017db13ee3bfd2b14cd8c3bc8481b39994735734336b

If you were to send an amount to another EVM address for which you possess the private key, you could also then send transactions from that address in addition to the three shown above.

Two optional new offline command line Javascript apps are included in this repo. These are 'makekey' which generates new private key / EVM address pairs and 'signer' which can take a private key (in 0x hex format) and the React client app's JSON transaction message and generates a full signature suitable for entry to the React client.

### Server and Client apps

Please follow the instructions from Alchemy's original readme.md which is copied here as [readmeAlchemy.md](./readmeAlchemy.md).

### makekey

1. Open a terminal within the `/makekey` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node makekey` to generate a new pair

### signer

1. Open a terminal within the `/signer` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node signer <your_chosen_private_key> "<JSON_to_sign>"` to generate the full transaction signature (starting in 0x). Note that the JSON must be enclosed in quotation marks.