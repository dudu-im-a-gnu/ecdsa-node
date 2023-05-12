const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const yargs = require("yargs");

yargs.scriptName("signer")
  .usage('$0 [args]')
  .positional('<private_key>', { type: 'string', describe: 'The private key to use starting in 0x'})
  .positional('<transaction_JSON>', { type: 'string', describe: 'The transaction JSON in "QUOTES"'})
  .help(true)
  .version(false)
  .parserConfiguration({"parse-positional-numbers": false});

const privateKey = yargs.argv._[0].slice(2);
const messageHash = toHex(keccak256(utf8ToBytes(yargs.argv._[1])));

secp.sign(messageHash, privateKey, { recovered: true }).then(([signature, recoveryBit]) => {
        console.log("Full signature:\n" + "0x" + toHex(signature) + recoveryBit);
});
