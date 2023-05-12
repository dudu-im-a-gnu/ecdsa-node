import server from "./server";
import { stringifyMsgJSON, testValidEVMAddress } from
  "./miscSuppRoutines";

function Wallet({ address, setAddress, balance, setBalance, setNonce,
  sendAmount, recipient, setMsgJSON }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (testValidEVMAddress(address)) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      const {
        data: { nonce },
      } = await server.get(`nextnonce/${address}`);
      setBalance(balance);
      setNonce(nonce);
      if(sendAmount && testValidEVMAddress(recipient))
      setMsgJSON(stringifyMsgJSON(nonce.toString(), recipient,
        sendAmount));
      else setMsgJSON("");
    }
    else {
      setBalance(0);
      setNonce(0);
      setMsgJSON("");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Enter an EVM address (0x then 40 hex digits)"
          value={address} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
