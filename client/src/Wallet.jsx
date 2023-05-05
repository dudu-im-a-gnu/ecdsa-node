import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, nonce, setNonce }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      const {
        data: { nonce },
      } = await server.get(`nextnonce/${address}`);
      setBalance(balance);
      setNonce(nonce);
    }
    else {
      setBalance(0);
      setNonce(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an EVM address (0x followed by 40 hex digits)" value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
      <div className="nonce">Next nonce: {nonce}</div>
    </div>
  );
}

export default Wallet;
