import { useState } from "react";
import server from "./server";
import { stringifyMsgJSON, testValidEVMAddress } from
  "./miscSuppRoutines";

function Transfer({ address, setBalance, nonce, setNonce, sendAmount,
  setSendAmount, recipient, setRecipient, msgJSON, setMsgJSON }) {
  const [msgFullSig, setMsgFullSig] = useState("");

  const setValue = (setter) => (evt) => {
    if(setter === setSendAmount) {
      const valueAsInt = Math.abs(parseInt(evt.target.value));
      const valueAsString = Number.isNaN(valueAsInt) ? "" :
        valueAsInt.toString();
      if(valueAsInt && testValidEVMAddress(address) &&
        testValidEVMAddress(recipient))
        setMsgJSON(stringifyMsgJSON(nonce.toString(), recipient,
          valueAsString));
      else setMsgJSON("");
      setter(valueAsInt ? valueAsString : "");
    }
    else if(setter === setRecipient) {
      const toAsString = evt.target.value;
      if(sendAmount && testValidEVMAddress(address) &&
        testValidEVMAddress(toAsString))
        setMsgJSON(stringifyMsgJSON(nonce.toString(), toAsString,
          sendAmount));
      else setMsgJSON("");
      setter(toAsString);
    }
    else {
      if(setter === setMsgFullSig) setter(evt.target.value);
      if(sendAmount && testValidEVMAddress(address) &&
        testValidEVMAddress(recipient))
        setMsgJSON(stringifyMsgJSON(nonce.toString(), recipient,
          sendAmount));
      else setMsgJSON("");
    }
  }

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance, newNonce },
      } = await server.post(`send`, {
        recipient,
        amount: parseInt(sendAmount),
        nonce,
        msgFullSig,
      });
      setBalance(balance);
      setNonce(newNonce);
      setMsgJSON(stringifyMsgJSON(newNonce.toString(), recipient,
        sendAmount));
      setMsgFullSig("");
    }
    catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
    <h1>Send Transaction</h1>

    <label>
      Send Amount
      <input
        placeholder="Positive integer value"
        value={sendAmount}
        onChange={setValue(setSendAmount)}
      ></input>
    </label>

    <label>
      Recipient
      <input
        placeholder="Enter an EVM address (0x then 40 hex digits)"
        value={recipient}
        onChange={setValue(setRecipient)}
      ></input>
    </label>

    <label>TO SIGN (by your signer):<textarea className="json" readOnly rows="3"
      placeholder="First enter valid wallet address, send amount and recipient" value={msgJSON} />
    </label>

    <label>
      Full signature (including recovery bit)
      <input
        placeholder="0x then hex digits"
        value={msgFullSig}
        onChange={setValue(setMsgFullSig)}
      ></input>
    </label>

    <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
