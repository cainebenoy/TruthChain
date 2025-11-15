# TruthChain

TruthChain helps content creators and platforms verify media authenticity. It combines AI deepfake detection with blockchain registration to provide tamper-evident provenance for digital files.

## The Problem

Deepfakes and manipulated media undermine trust online and can spread misinformation rapidly, making it hard to know what content is genuine.

## Our Solution

TruthChain is a three-part system: 
- A **React frontend** with two pages:
  - **Home/Register** - Upload files for AI verification and blockchain registration via MetaMask
  - **Live Demo** - Interactive carousel that verifies media authenticity against the blockchain in real-time
- A **Python/FastAPI AI backend** that runs deepfake detection using Hugging Face models
- A **Solidity smart contract** on Sepolia testnet that records file hashes immutably for provenance verification

## Features

✅ Upload and register files with AI deepfake detection  
✅ MetaMask wallet integration for blockchain transactions  
✅ Real-time blockchain verification carousel  
✅ Automatic hash checking as you browse media  
✅ Visual badges showing DEEPFAKE (registered) vs REAL (unregistered) status

## Tech Stack

- **Frontend:** React, TypeScript, Ethers.js, Vite, React Router, React Responsive Carousel
- **AI Backend:** Python, FastAPI, Transformers (Hugging Face), Uvicorn
- **Blockchain:** Solidity, Hardhat, Ethereum Sepolia Testnet

## How to Run

Below are the basic commands to install and run each component from the repository root.

### Blockchain

```powershell
cd blockchain
npm install
# Add your .env with PRIVATE_KEY and SEPOLIA_RPC_URL
# Deploy (optional - contract already deployed at 0xf9Dc86ece60cb27CC46da56Fd970d23a5B0A24fc):
npx hardhat run scripts/deployRegistry.ts --network sepolia
```

### AI Backend

```powershell
cd ai-backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows
# source venv/bin/activate      # macOS / Linux
pip install -r requirements.txt
uvicorn api:app --reload
# Server runs on http://127.0.0.1:8000
```

### Frontend

```powershell
cd frontend\truthchain-ui
npm install
npm run dev
# Open http://localhost:5173 in your browser
```

## Demo Instructions

1. Ensure both AI backend (port 8000) and frontend (port 5173) are running
2. Open http://localhost:5173/
3. **Home Page**: Connect MetaMask (Sepolia network), upload an image, and register it on-chain
4. **Live Demo Page**: Browse the carousel to see real-time blockchain verification of media files

---

**Contract Address (Sepolia):** `0xf9Dc86ece60cb27CC46da56Fd970d23a5B0A24fc`
