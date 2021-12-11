import { useState } from "react";
import "./App.css";
import ConnectWallet from "./ConnectWallet";
import WalletBalance from "./WalletBalance";

function App() {
  const [errorMessage, setError] = useState("");
  const [successMessage, setSuccess] = useState("");
  const [walletConnected, setWallet] = useState(false);
  const [walletBalance, setBalance] = useState(0);
  const [voterId, setVoterId] = useState(0);
  const [currentScreen, setScreen] = useState("CONNECT");
  // CONNECT, WALLET, TRANSFER, TRANSFERDAI, TRANSFER_MULTISIG

  return (
    <div className="App">
      <h1 className="text-center main-heading">Token Transfer App</h1>
      {currentScreen === "CONNECT" ? (
        <ConnectWallet
          setError={setError}
          setScreen={setScreen}
          setWallet={setWallet}
          walletConnected={walletConnected}
        />
      ) : currentScreen === "WALLET" ? (
        <WalletBalance
          walletBalance={walletBalance}
          voterId={voterId}
          walletConnected={walletConnected}
          setBalance={setBalance}
          setVoterId={setVoterId}
          setError={setError}
          setScreen={setScreen}
        />
      ) : (
        <></>
      )}

      <p className="text-center error-message">{errorMessage}</p>
      <p className="text-center success-message">{successMessage}</p>
    </div>
  );
}

export default App;
