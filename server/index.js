const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x7136dbf5c587f3a529a91d05c36d7957f41dd57b": 100,
  "0xfcad0b19bb29d4674531d6f115237e16afce377c": 50,
  "0xb1de725ac0edcba357ec1fb72a637ef6e9dad4fc": 75,
};

const nonces = {};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.get("/nextnonce/:address", (req, res) => {
  const { address } = req.params;
  const nonce = nonces[address] || 0;
  res.send({ nonce });
});

app.post("/send", (req, res) => {
  const { amount, recipient, nonce, msgFullSig} = req.body;
  let sender, returnMessage;

  try {
    const msgObject = {
    nonce: nonce.toString(),
    to: recipient,
    value: amount.toString(),
    }
    const msgJSON = JSON.stringify(msgObject);
    const messageHash = toHex(keccak256(utf8ToBytes(msgJSON)));
    const msgSig = msgFullSig.slice(2, -1);
    const msgRecoveryBit = parseInt(msgFullSig.slice(-1));
    const senderPublicKey = secp.recoverPublicKey(messageHash,
      msgSig, msgRecoveryBit);
    sender = "0x" +
      toHex(keccak256(senderPublicKey.slice(1)).slice(-20));
  }
  catch(err) {
    res.status(400).send({ message: "Malformed signature!" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);
  initializeAddressNonce(sender);

  const amountAsNum = parseFloat(amount); // (Check for int is below)

  switch(true) {
    case typeof sender !== 'string':
    case sender.length !== 42:
    case sender.slice(0,2).toLowerCase() !== "0x":
    case sender.slice(2).search(/[^a-fA-F0-9]/) !== -1:
    case nonce !== nonces[sender]:
    case typeof recipient !== 'string':
    case recipient.length !== 42:
    case recipient.slice(0,2).toLowerCase() !== "0x":
    case recipient.slice(2).search(/[^a-fA-F0-9]/) !== -1:
    case balances[sender] < amount:
      returnMessage = { message:
        "Invalid signature or transaction details!" };
      break;
    case !Number.isInteger(amountAsNum):
      returnMessage = { message:
        "Can only transfer integer amounts!\n(Must be < " +
        Number.MAX_SAFE_INTEGER + ")" };
      break;
    case amountAsNum < 1:
      returnMessage = { message: "Transfer must be for 1 or more!" };
      break;
    case recipient === sender:
      returnMessage = { message: "Can't transfer to yourself!" };
      break;
    default:
      // No error, so let's wrap up:
      balances[sender] -= amountAsNum;
      balances[recipient] += amountAsNum;
      res.send({ balance: balances[sender],
        newNonce: ++(nonces[sender]) });
      return;
  }
  // Switch block has an error, so:
  res.status(400).send(returnMessage);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!(address in balances)) balances[address] = 0;
}

function initializeAddressNonce(address) {
  if(!(address in nonces)) nonces[address] = 0;
}