import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel CSS
import TruthRegistryABI from './TruthRegistry.json';

// --- PASTE YOUR SEPOLIA CONTRACT ADDRESS HERE ---
const CONTRACT_ADDRESS = "0xf9Dc86ece60cb27CC46da56Fd970d23a5B0A24fc";
// --- PASTE YOUR SEPOLIA ALCHEMY RPC URL HERE ---
// You can get this from your 'blockchain/.env' file
const SEPOLIA_RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/elVFe8DTCiAfIi0jIuNZY";

// This provider is read-only. It doesn't need MetaMask.
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, TruthRegistryABI.abi, provider);

// --- MEDIA FILES ---
// These files *must* exist in your 'frontend/truthchain-ui/public/' folder
const mediaItems = [
  { type: 'image', url: '/image1.jpg', title: 'Mountain Landscape' },
  { type: 'image', url: '/image2.png', title: 'AI-Generated Art' },
  { type: 'image', url: '/image3.jpeg', title: 'Company Headshot' },
  { type: 'image', url: '/image4.jpeg', title: 'Digital Asset' },
  { type: 'video', url: '/video1.mp4', title: 'Tech Conference Clip' },
];

// Define the shape of our verification state
type VerificationStatus = 'pending' | 'verified' | 'unregistered' | 'unchecked';
interface StatusCache {
  [url: string]: VerificationStatus;
}

// Helper function to hash a file from a URL
const hashFileFromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

function DemoPage() {
  const [statuses, setStatuses] = useState<StatusCache>({});

  // This function is triggered when the slide changes
  const checkMedia = async (index: number) => {
    const item = mediaItems[index];
    if (!item || (statuses[item.url] && statuses[item.url] !== 'unchecked')) {
      return; // Already checked or checking
    }

    // Set to pending
    setStatuses(prev => ({ ...prev, [item.url]: 'pending' }));

    try {
      const hash = await hashFileFromUrl(item.url);
      const isRegistered = await contract.isFileRegistered(hash);
      
      // Set final status
      setStatuses(prev => ({
        ...prev,
        [item.url]: isRegistered ? 'verified' : 'unregistered'
      }));

    } catch (error) {
      console.error("Error verifying media:", item.url, error);
      setStatuses(prev => ({ ...prev, [item.url]: 'unregistered' }));
    }
  };

  // Check the first item when the page loads
  useEffect(() => {
    checkMedia(0);
  }, []);

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>TruthChain "Live Verification" Demo</h1>
      <p>As you browse, each item is hashed and checked against the blockchain in real-time.</p>
      
      <div style={{ border: '2px solid #555', borderRadius: '8px', overflow: 'hidden' }}>
        <Carousel
          showThumbs={false}
          showIndicators={true}
          infiniteLoop={true}
          onChange={(index) => checkMedia(index)} // <-- THIS IS THE MAGIC
        >
          {mediaItems.map((item) => (
            <div key={item.url} style={{ position: 'relative', background: '#000' }}>
              
              <VerificationBadge status={statuses[item.url]} />

              {item.type === 'image' ? (
                <img src={item.url} alt={item.title} style={{ maxHeight: '500px', objectFit: 'contain' }} />
              ) : (
                <video src={item.url} controls style={{ maxHeight: '500px', width: '100%' }} />
              )}
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

// Helper component for the badge
const VerificationBadge: React.FC<{ status: VerificationStatus | undefined }> = ({ status }) => {
  let text = "...";
  let color = "#555"; // grey

  if (status === 'verified') {
    text = "⚠️ DEEPFAKE";
    color = "#F44336"; // red - registered = deepfake
  } else if (status === 'unregistered') {
    text = "✅ REAL";
    color = "#4CAF50"; // green - not registered = real
  } else if (status === 'pending') {
    text = "Verifying...";
    color = "#FF9800"; // orange
  } else {
    return null; // Don't show a badge if it's 'unchecked'
  }

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: color,
      color: 'white',
      padding: '8px 12px',
      borderRadius: '5px',
      fontWeight: 'bold',
      fontSize: '14px',
      zIndex: 10,
    }}>
      {text}
    </div>
  );
};

export default DemoPage;
