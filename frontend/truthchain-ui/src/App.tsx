import { useState } from 'react';
import { ethers } from 'ethers';
import TruthRegistryABI from './TruthRegistry.json';

// --- PASTE YOUR DEPLOYED CONTRACT ADDRESS HERE ---
const CONTRACT_ADDRESS = "0xf9Dc86ece60cb27CC46da56Fd970d23a5B0A24fc";

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("Please connect your wallet.");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Connects to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        setStatus("Connecting to MetaMask...");
        
        const provider = new ethers.BrowserProvider(window.ethereum, "any");
        // Request account access
        const accounts = await provider.send('eth_requestAccounts', []);
        
        // Ensure we're on the Sepolia network
        const network = await provider.getNetwork();
        console.log("Current network:", network.chainId, "Need: 11155111");
        
        if (network.chainId !== 11155111n) { // 11155111n is the chainId for Sepolia
          setStatus(`Wrong network! You're on chain ${network.chainId}. Please switch MetaMask to Sepolia (chain 11155111).`);
          setIsLoading(false);
          return;
        }
        
        setAccount(accounts[0]);
        setStatus("Wallet connected. Please select a file.");
        setIsLoading(false);
      } catch (error: any) {
        console.error(error);
        setStatus(`Connection error: ${error.message || "Failed to connect wallet."}`);
        setIsLoading(false);
      }
    } else {
      setStatus("Please install MetaMask!");
    }
  };

  // 2. Handles file selection from the input
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("File selected. Ready to verify or check.");
    }
  };

  // 3. Hashes the file in the browser (SHA-256)
  const getFileHash = async (fileToHash: File): Promise<string> => {
    const buffer = await fileToHash.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // 4. Main function: Verify with AI and Register on Blockchain
  const handleRegister = async () => {
    if (!file) return setStatus("Please select a file first.");
    if (!account) return setStatus("Please connect your wallet.");

    setIsLoading(true);

    try {
      // === AI VERIFICATION STEP ===
      setStatus("Step 1/4: Uploading to AI for verification...");
      const formData = new FormData();
      formData.append("file", file);

      const aiResponse = await fetch("http://127.0.0.1:8000/detect", {
        method: "POST",
        body: formData,
      });

      if (!aiResponse.ok) throw new Error("AI server error.");
      const aiResult = await aiResponse.json();

      //if (aiResult.is_fake) {
      //  setStatus(`AI Result: DEEPFAKE (Confidence: ${aiResult.confidence.toFixed(2)}). Registration cancelled.`);
      //  setIsLoading(false);
      //  return;
      //}

      setStatus(`Step 2/4: AI confirmed: ${aiResult.label}. Hashing file...`);

      // === BLOCKCHAIN REGISTRATION STEP ===
      const fileHash = await getFileHash(file);
      setStatus(`Step 3/4: File hash: ${fileHash.substring(0, 10)}... Registering on blockchain...`);

      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TruthRegistryABI.abi, signer);

      const tx = await contract.registerFile(fileHash);
      setStatus("Step 4/4: Transaction sent... waiting for confirmation...");
      
      await tx.wait(); // Wait for 1 confirmation

      setStatus(`✅ SUCCESS! File registered on the Polygon Amoy blockchain.`);
      setIsLoading(false);

    } catch (error: any) {
      console.error(error);
      if (error.message.includes("File already registered")) {
        setStatus("Error: This file has ALREADY been registered.");
      } else {
        setStatus("An error occurred. See console for details.");
      }
      setIsLoading(false);
    }
  };

  // 5. Function to check a file's status
  const handleCheck = async () => {
    if (!file) return setStatus("Please select a file to check.");

    setIsLoading(true);
    setStatus("Hashing file to check...");

    try {
      const fileHash = await getFileHash(file);
      setStatus(`Hash: ${fileHash.substring(0, 10)}... Checking registry...`);

      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TruthRegistryABI.abi, provider);

      const isRegistered = await contract.isFileRegistered(fileHash);

      if (isRegistered) {
        setStatus("✅ VERIFIED: This file is authentic and in the registry.");
      } else {
        setStatus("❌ NOT FOUND: This file is not in the registry.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setStatus("An error occurred while checking.");
      setIsLoading(false);
    }
  };

  // --- JSX for the UI ---
  return (
    <div className="container">
      <header>
        <h1>TruthChain</h1>
        <p>AI-Powered Content Authenticity & Provenance</p>
      </header>

      {!account ? (
        <button onClick={connectWallet} disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect MetaMask Wallet"}
        </button>
      ) : (
        <p className="wallet-status">Connected: {account.substring(0, 6)}...{account.substring(38)}</p>
      )}

      <div className="card">
        <input type="file" onChange={onFileChange} disabled={!account || isLoading} />
      </div>

      <div className="actions">
        <button 
          className="btn-register"
          onClick={handleRegister} 
          disabled={!file || !account || isLoading}
        >
          Verify & Register File
        </button>
        <button 
          className="btn-check"
          onClick={handleCheck} 
          disabled={!file || !account || isLoading}
        >
          Check File Authenticity
        </button>
      </div>

      {isLoading && <div className="spinner"></div>}
      
      <div className="status-box">
        <p>Status: {status}</p>
      </div>
    </div>
  );
}

export default App;
