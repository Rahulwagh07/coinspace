import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Modal from "./Modal";
import { MdDelete } from "react-icons/md";

interface Wallet {
  publicKey: string;
  privateKey?: string;
  balance: number;  
}

interface WalletCardProps {
  type: 'ETH' | 'SOL';
  wallet: Wallet;
  balance: number;  
  index: number;
  onDelete: (publicKey: string) => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ type, wallet, balance, index, onDelete }) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const handleSendClick = () => {
    setIsModalOpen(true);
  };

  const handleDeleteConfirmation = () => {
    onDelete(wallet.publicKey);
    setIsDeleteConfirmationOpen(false);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`wallet-${wallet.publicKey}`}>
        <AccordionTrigger className="flex justify-between items-center">
           <span>Wallet {index + 1} ({type})</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex justify-between">
            <p className="mb-2 overflow-hidden">Public Key: {wallet.publicKey}</p>
            <MdDelete 
              className="text-red-400 cursor-pointer"
              size={24}
              onClick={() => setIsDeleteConfirmationOpen(true)}
            />
          </div>
          <p className="mb-2">Balance: {balance} {type}</p> 
          {showPrivateKey && wallet.privateKey && (
            <p className="mb-2 overflow-hidden">Private Key: {wallet.privateKey}</p>
          )}
          <Button  
            variant={"outline"} 
            size={"sm"} 
            onClick={() => setShowPrivateKey(!showPrivateKey)} 
            className="mt-2 border rounded-xl"
          >
            {showPrivateKey ? "Hide Private Key" : "Show Private Key"}
          </Button>
          {type === 'SOL' && (
            <Button 
              variant={"outline"} 
              size={"sm"} 
              onClick={handleSendClick} 
              className="mt-2 ml-4 border rounded-xl"
            >
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
          {isDeleteConfirmationOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <p className="mb-4">Are you sure you want to delete this wallet?</p>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant={"outline"} 
                    onClick={() => setIsDeleteConfirmationOpen(false)} 
                    className="border rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant={"destructive"} 
                    onClick={handleDeleteConfirmation} 
                    className="border rounded-xl"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default WalletCard;
