export function stringifyMsgJSON(nonce, to, amount) {
  const msgObject = {
  nonce: nonce.toString(),
  to: to,
  value: amount,
  }

  return JSON.stringify(msgObject);
}

export function testValidEVMAddress(address) {
  return address.length === 42 &&
    address.slice(0,2).toLowerCase() === "0x" &&
    address.slice(2).search(/[^a-fA-F0-9]/) === -1;
}
