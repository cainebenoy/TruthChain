import { useState } from 'react';
import { ethers } from 'ethers';
import TruthRegistryABI from './TruthRegistry.json';
import { Routes, Route, Link } from 'react-router-dom';
import DemoPage from './DemoPage';

const CONTRACT_ADDRESS = "0xf9Dc86ece60cb27CC46da56Fd970d23a5B0A24fc";

function App() {
  return (
    <div>
      <nav style={{ 
        display: 'flex', 
        gap: '1rem', 
        padding: '1rem', 
        backgroundColor: '#1a1a1a', 
        justifyContent: 'center' 
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home (Register)</Link>
        <Link to="/demo" style={{ color: 'white', textDecoration: 'none' }}>Live Demo Page</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
    </div>
  );
}

function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("Please connect your wallet.");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsLoading(true);
        setStatus("Connecting to MetaMask...");
        
        const provider = new ethers.BrowserProvider(window.ethereum, "any");
        const accounts = await provider.send('eth_requestAccounts', []);
        
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111n) {
          setStatus("Please switch your MetaMask to the Sepolia network.");
          setIsLoading(false);
          return;
        }
        
        setAccount(accounts[0]);
        setStatus("Wallet connected. Please select a file.");
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setStatus("Failed to connect wallet.");
        setIsLoading(false);
      }
    } else {
      setStatus("Please install MetaMask!");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("File selected. Ready to verify or check.");
    }
  };

  const getFileHash = async (fileToHash: File): Promise<string> => {
    const buffer = await fileToHash.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleRegister = async () => {
    if (!file) return setStatus("Please select a file first.");
    if (!account) return setStatus("Please connect your wallet.");

    setIsLoading(true);

    try {
      setStatus("Step 1/4: Uploading to AI for verification...");
      const formData = new FormData();
      formData.append("file", file);

      const aiResponse = await fetch("https://truthchain-api.onrender.com/detect", {
        method: "POST",
        body: formData,
      });

      if (!aiResponse.ok) throw new Error("AI server error.");
      const aiResult = await aiResponse.json();

      setStatus(`Step 2/4: AI confirmed: ${aiResult.label}. Hashing file...`);

      const fileHash = await getFileHash(file);
      setStatus(`Step 3/4: File hash: ${fileHash.substring(0, 10)}... Registering on blockchain...`);

      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TruthRegistryABI.abi, signer);

      const tx = await contract.registerFile(fileHash);
      setStatus("Step 4/4: Transaction sent... waiting for confirmation...");
      
      await tx.wait(); 

      setStatus(`✅ SUCCESS! File registered on the Sepolia blockchain.`);
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

  const handleCheck = async () => {
    if (!file) return setStatus("Please select a file to check.");
    if (!account) return setStatus("Please connect your wallet.");

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