const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const newPrivateKey = secp.utils.randomPrivateKey();
const newPublicKey = secp.getPublicKey(newPrivateKey);
const newAddress = keccak256(newPublicKey.slice(1)).slice(-20);

console.log("Private key:\n0x" + toHex(newPublicKey));
console.log("Address:\n0x" + toHex(newAddress));
