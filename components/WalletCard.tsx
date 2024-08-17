import { useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";

interface Wallet {
  publicKey: string;
  privateKey?: string;
  balance: number;  
}

interface WalletCardProps {
  type: 'ETH' | 'SOL';
  wallet: Wallet;
  balance: number;  
}

const WalletCard: React.FC<WalletCardProps> = ({ type, wallet, balance }) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSendClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="border rounded-xl p-4  mb-4 shadow-md">
      <h4 className="text-xl font-bold mb-2">{type}</h4>
      <p className="text-lg mb-2 overflow-hidden">Public Key: {wallet.publicKey}</p>
      <p className="text-lg mb-2">Balance: {balance} {type}</p> 
      {showPrivateKey && wallet.privateKey && (
        <p className="text-lg mb-2 overflow-hidden">Private Key: {wallet.privateKey}</p>
      )}
      <Button size={"sm"} onClick={() => setShowPrivateKey(!showPrivateKey)} className="mt-2">
        {showPrivateKey ? "Hide Private Key" : "Show Private Key"}
      </Button>
      {type === 'SOL' && (
        <Button size={"sm"} onClick={handleSendClick} className="mt-2 ml-4">
          Send SOL
        </Button>
      )}
      {isModalOpen && type === 'SOL' && (
        <Modal
          publicKey={wallet.publicKey}
          privateKey={wallet.privateKey}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default WalletCard;
