import { formatEther } from "@ethersproject/units";
import { BigNumber, ethers, utils } from "ethers";
import { useEffect, useState } from "react";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contractConfig";

export default function WalletBalance({
  walletConnected,
  walletBalance,
  setBalance,
  setError,
  setScreen,
  voterId,
  setVoterId,
}) {
  const [isLoading, setLoading] = useState(true);
  const [contract, setContract] = useState();
  const [candidate, setCandidate] = useState();

  useEffect(() => {
    const getWalletBalance = async () => {
      try {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let accountBalance = await provider.getBalance(walletConnected);
        setBalance(accountBalance);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    };

    const getVoterId = async () => {
      try {
        let voterId = await contract.tokenOfOwnerByIndex(walletConnected, 0);
        setLoading(false);
        setVoterId(voterId);
      } catch (error) {
        console.error(error);
        setVoterId("You haven't registered for voting yet.");
      }
    };

    const setupContract = () => {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let nftvoting = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider.getSigner()
      );
      setContract(nftvoting);
    };

    if (contract) {
      getVoterId();
      getWalletBalance();
    } else {
      setupContract();
    }
  }, [walletConnected, setBalance, setError, setVoterId, contract]);

  const refreshBalance = async () => {
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let accountBalance = await provider.getBalance(walletConnected);
      setBalance(accountBalance);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError(e);
    }
  };

  const refreshVoterId = async () => {
    try {
      let voterId = await contract.tokenOfOwnerByIndex(walletConnected, 0);
      setLoading(false);
      setVoterId(voterId);
    } catch (error) {
      setVoterId("You haven't registered for voting yet.");
    }
  };

  const registerForVoting = async (e) => {
    try {
      setVoterId("Registering...");
      setError("");
      let txc = await contract.registerAsVoter();
      txc.wait();
    } catch (error) {
      console.error(error);
      setError(error.error.message);
    } finally {
      refreshVoterId();
    }
  };

  const handleVote = (e) => {
    e.preventDefsault();
    setError("");

    contract.vote();
  };

  return (
    <>
      <h3 className="text-center">Your Wallet Balance</h3>
      <p>{walletConnected}</p>
      <h1 className="text-center wallet-balance">
        {isLoading ? "Loading.." : <>{formatEther(walletBalance)} ETH</>}
      </h1>

      <h1 className="text-center wallet-balance">
        Voter ID:
        {isLoading ? (
          "Loading.."
        ) : (
          <>
            {voterId instanceof BigNumber
              ? utils.formatUnits(voterId, "wei")
              : voterId}
          </>
        )}
      </h1>

      <button onClick={refreshBalance}>Refresh Balance</button>
      <br />
      <br />
      <button onClick={registerForVoting}>Register for Voting</button>
      <form onSubmit={handleVote}>
        <p>Cast your vote</p>
        <input
          type="text"
          value={candidate}
          onChange={(e) => setCandidate(e.target.value)}
        />
        <button type="submit">Vote</button>
      </form>
    </>
  );
}
