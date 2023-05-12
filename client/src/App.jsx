import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [nonce, setNonce] = useState(0);
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [msgJSON, setMsgJSON] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        setNonce={setNonce}
        sendAmount={sendAmount}
        recipient={recipient}
        msgJSON={msgJSON}
        setMsgJSON={setMsgJSON}
      />
      <Transfer
        address={address}
        setBalance={setBalance}
        nonce={nonce}
        setNonce={setNonce}
        sendAmount={sendAmount}
        setSendAmount={setSendAmount}
        recipient={recipient}
        setRecipient={setRecipient}
        msgJSON={msgJSON}
        setMsgJSON={setMsgJSON}/>
    </div>
  );
}

export default App;
