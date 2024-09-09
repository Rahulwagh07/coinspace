import { useState } from "react";
import {sendSolanaTransaction } from "@/lib/transactions";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

interface  ModalProps {
  publicKey: string;
  privateKey: string | undefined;
  onClose: () => void;
  setTransactionSuccess: (success: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ publicKey, privateKey, onClose, setTransactionSuccess }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    if (!privateKey) {
      return;
    }
    if (!recipient || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Input are not valid..");
      setLoading(false);
      return;
    }
  
    try {
      await sendSolanaTransaction(privateKey, recipient, parseFloat(amount));
      toast.success("Transaction successfull!");
      onClose();
      setTransactionSuccess(true);
      setLoading(false);
    } catch (error: unknown ) {
      console.error('Error sending SOL:', error);
      toast.error("Transaction failed!");
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-700 p-12 rounded-xl border">
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Send</h4>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
        />
        <input
          type="number"
          placeholder="Amount (SOL)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
        />
         <div className="flex justify-end gap-4 mt-4">
            <Button 
              variant={"outline"} 
              onClick={onClose}
              className="border rounded-xl"
              >
                Cancel
            </Button>
            <Button 
              onClick={handleSend}
              className="border rounded-xl"
              >
              {loading ? "Sending.." : "Send"}
            </Button>
          </div>
      </div>
    </div>
  );
};

export default Modal;
