# TruthChain

TruthChain helps content creators and platforms verify media authenticity. It combines AI deepfake detection with blockchain registration to provide tamper-evident provenance for digital files.

## The Problem

Deepfakes and manipulated media undermine trust online and can spread misinformation rapidly, making it hard to know what content is genuine.

## Our Solution

TruthChain is a three-part system: a React frontend lets users upload files and request verification; a Python/FastAPI AI backend runs a deepfake-detection model and returns a verdict; and a Solidity smart contract on the Sepolia testnet records authentic file hashes immutably so anyone can later verify provenance.

## Tech Stack

- **Frontend:** React, TypeScript, Ethers.js, Vite
- **AI Backend:** Python, FastAPI, Transformers (Hugging Face)
- **Blockchain:** Solidity, Hardhat, Polygon Sepolia Testnet

## How to Run

Below are the basic commands to install and run each component from the repository root.

### Blockchain

```powershell
cd blockchain
npm install
# Add your .env with PRIVATE_KEY and SEPOLIA_RPC_URL
# Deploy (optional):
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
```

### Frontend

```powershell
cd frontend\truthchain-ui
npm install
npm run dev
# Open http://localhost:5173 in your browser
```

---

If you'd like, I can also add example `.env` templates and a short demo script to the repo. Let me know.
