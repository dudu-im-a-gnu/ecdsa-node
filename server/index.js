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

app.post("/send", (req, res) => {
  const { sender, recipient, amount, nonce } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  initializeAddressNonceSet(sender);

  switch(true) {
    case nonces[sender].has(nonce):
      res.status(400).send({ message: "Can't replay an old transaction!" });
      break;
    case typeof recipient !== 'string':
    case recipient.length !== 42:
    case recipient.slice(0,2).toLowerCase() !== "0x":
    case Number.isNaN(parseInt(recipient, 16)):
      res.status(400).send({ message: "Invalid recipient address!" });
      break;
    case !Number.isInteger(amount):
      res.status(400).send({ message: "Can only transfer integer amounts!\n(Must be < " + Number.MAX_SAFE_INTEGER + ")" });
      break;
    case amount < 1:
      res.status(400).send({ message: "Transfer must be for 1 or more!" });
      break;
    case balances[sender] < amount:
      res.status(400).send({ message: "Not enough funds!\nIs your wallet address correct?" });
      break;
    case recipient == sender:
      res.status(400).send({ message: "Can't transfer to yourself!" });
      break;
    default:
      nonces[sender].add(nonce);
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
      break;
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function initializeAddressNonceSet(address) {
  if(!(address in nonces)) nonces[address] = new Set();
}