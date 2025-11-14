# TruthChain

> AI-Powered Content Authenticity & Provenance on Blockchain

TruthChain is a decentralized application that combines AI deepfake detection with blockchain technology to verify and register authentic digital content. Upload an image, verify its authenticity using AI, and create an immutable record on the blockchain.

## 🎯 Overview

TruthChain addresses the growing problem of deepfakes and manipulated media by providing a two-layer verification system:

1. **AI Detection**: Analyzes uploaded content using a state-of-the-art deepfake detection model
2. **Blockchain Registration**: Creates an immutable, timestamped record of authentic content on the Ethereum blockchain

## ✨ Features

- 🤖 **AI-Powered Detection**: Utilizes `prithivMLmods/Deep-Fake-Detector-v2-Model` for deepfake analysis
- ⛓️ **Blockchain Registry**: Smart contract on Sepolia testnet for immutable content registration
- 🔐 **MetaMask Integration**: Secure wallet connection for blockchain transactions
- 🔍 **Content Verification**: Check if content has been previously registered and verified
- 🎨 **Modern UI**: Clean, responsive React interface with dark mode

## 🏗️ Architecture

### Three-Layer System

```
┌─────────────────────────────────────────────┐
│         Frontend (React + TypeScript)       │
│  • MetaMask Integration                     │
│  • File Upload & Hashing                    │
│  • User Interface                           │
└─────────────────┬───────────────────────────┘
                  │
                  ├──────────────┐
                  ▼              ▼
┌─────────────────────────┐   ┌──────────────────────────┐
│  AI Backend (FastAPI)   │   │  Blockchain (Solidity)   │
│  • Deepfake Detection   │   │  • TruthRegistry.sol     │
│  • Model: Deep-Fake     │   │  • Sepolia Testnet       │
│    Detector v2          │   │  • File Hash Registry    │
└─────────────────────────┘   └──────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Python** (3.10+)
- **MetaMask** browser extension
- **Sepolia ETH** (free from faucet)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cainebenoy/TruthChain.git
   cd TruthChain
   ```

2. **Set up the AI Backend**
   ```bash
   cd ai-backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1  # Windows
   # source venv/bin/activate    # Linux/Mac
   
   pip install fastapi uvicorn torch transformers pillow python-multipart
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend/truthchain-ui
   npm install
   ```

4. **Configure Blockchain** (Optional - contract already deployed)
   ```bash
   cd ../../blockchain
   npm install
   
   # Create .env file with:
   # PRIVATE_KEY=your_private_key
   # SEPOLIA_RPC_URL=your_alchemy_or_infura_url
   ```

## 🎮 Running the Application

### Step 1: Start the AI Backend
```bash
cd ai-backend
.\venv\Scripts\Activate.ps1
uvicorn api:app --reload
```
Server runs at: http://127.0.0.1:8000

### Step 2: Start the Frontend
```bash
cd frontend/truthchain-ui
npm run dev
```
App runs at: http://localhost:5173

### Step 3: Configure MetaMask
1. Install MetaMask extension
2. Switch to **Sepolia Test Network**
   - If not visible: Settings → Advanced → Show test networks
3. Get free Sepolia ETH from a faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

## 📖 User Guide

### Registering Content

1. **Connect Wallet**: Click "Connect MetaMask Wallet" and approve the connection
2. **Select File**: Choose an image file (JPG, PNG, etc.)
3. **Verify & Register**:
   - Click "Verify & Register File"
   - AI analyzes the content (~30s on first use as model loads)
   - If authentic, file hash is sent to blockchain
   - Approve the MetaMask transaction
   - Wait for confirmation
4. **Success**: File is now registered with an immutable timestamp

### Verifying Content

1. **Select File**: Upload a file you want to verify
2. **Check Authenticity**: Click "Check File Authenticity"
3. **Result**:
   - ✅ **Verified**: File exists in the registry (authentic and previously registered)
   - ❌ **Not Found**: File is not in the registry

## 🔧 Smart Contract

### TruthRegistry.sol

**Deployed on Sepolia**: `0xf9Dc86ece60cb27CC46da56Fd970d23a5B0A24fc`

**Key Functions**:
- `registerFile(bytes32 fileHash)`: Register a new file hash
- `isFileRegistered(bytes32 fileHash)`: Check if a file is registered
- `fileRegistry(bytes32 fileHash)`: Get registration timestamp

**Events**:
- `FileRegistered(bytes32 indexed fileHash, address indexed creator, uint256 timestamp)`

### Deploying to Sepolia (if needed)

```bash
cd blockchain
npx hardhat run scripts/deployRegistry.ts --network sepolia
```

## 🧪 Technology Stack

### Frontend
- **React** 18 with TypeScript
- **Vite** for fast development
- **ethers.js** v6 for blockchain interaction
- **CSS** with dark mode styling

### Backend
- **FastAPI** for REST API
- **PyTorch** for model inference
- **Transformers** (Hugging Face) for AI model
- **Pillow** for image processing

### Blockchain
- **Solidity** 0.8.20
- **Hardhat** for development
- **Sepolia** testnet for deployment
- **Alchemy** for RPC provider

### AI Model
- **prithivMLmods/Deep-Fake-Detector-v2-Model**
- Image classification pipeline
- Binary output: Deepfake vs Realism

## 📁 Project Structure

```
TruthChain/
├── ai-backend/
│   ├── api.py              # FastAPI server with /detect endpoint
│   ├── venv/               # Python virtual environment
│   └── requirements.txt    # Python dependencies
│
├── blockchain/
│   ├── contracts/
│   │   └── TruthRegistry.sol    # Smart contract
│   ├── scripts/
│   │   └── deployRegistry.ts    # Deployment script
│   ├── hardhat.config.ts        # Hardhat configuration
│   └── .env                     # Private keys (not in git)
│
└── frontend/
    └── truthchain-ui/
        ├── src/
        │   ├── App.tsx              # Main React component
        │   ├── index.css            # Styling
        │   ├── TruthRegistry.json   # Contract ABI
        │   └── vite-env.d.ts        # TypeScript definitions
        ├── package.json
        └── vite.config.ts
```

## 🔐 Security Notes

- ⚠️ **Never commit `.env` files** with private keys
- ⚠️ **Use testnet only** for development
- ⚠️ Contract uses simple access control (anyone can register)
- ⚠️ AI model is for demonstration purposes

## 🚧 Known Limitations

- AI model runs on CPU (slower inference)
- First AI request triggers model download (~343MB)
- Smart contract doesn't prevent duplicate registrations from different accounts
- No file size limits on frontend
- Supports images only (model limitation)

## 🛣️ Roadmap

- [ ] Add file size validation
- [ ] Support video content detection
- [ ] Implement IPFS for decentralized file storage
- [ ] Add user authentication system
- [ ] Deploy to Ethereum mainnet
- [ ] GPU acceleration for AI backend
- [ ] Batch registration support
- [ ] Advanced analytics dashboard

## 📄 License

This project is part of a hackathon submission and is provided as-is for educational purposes.

## 🤝 Contributing

This is a hackathon project. Feel free to fork and experiment!

## 📞 Contact

- GitHub: [@cainebenoy](https://github.com/cainebenoy)
- Repository: [TruthChain](https://github.com/cainebenoy/TruthChain)

## 🙏 Acknowledgments

- **prithivMLmods** for the Deep-Fake-Detector-v2-Model
- **Hugging Face** for the Transformers library
- **Alchemy** for blockchain infrastructure
- **Sepolia** testnet for free testing environment

---

**Built with ❤️ for the future of digital content authenticity**
