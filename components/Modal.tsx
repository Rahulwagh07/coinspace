import { useState } from "react";
import { getSolanaBalance, sendSolanaTransaction } from "@/lib/transactions";

interface  ModalProps {
  publicKey: string;
  privateKey: string | undefined;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ publicKey, privateKey, onClose }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleSend = async () => {
    if (!privateKey) {
      setStatus("Private key is missing!");
      return;
    }
    if (!recipient || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setStatus("Invalid Input");
      return;
    }
  
    console.log("Private Key:", privateKey);
    console.log("Recipient Address:", recipient);
    console.log("Amount:", amount);
  
    setStatus("Sending...");
    try {
      const signature = await sendSolanaTransaction(privateKey, recipient, parseFloat(amount));
      const updatedBalance = await getSolanaBalance(publicKey);
      setStatus(`Transaction confirmed with signature: ${signature}. New Balance: ${updatedBalance} SOL`);
    } catch (error: unknown ) {
      console.error('Error sending SOL:', error);
      if(error instanceof Error){
        setStatus(`Transaction failed: ${error.message}`);
      }
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center border rounded-lg justify-center bg-black bg-opacity-50 dark:bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Send</h4>
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
            <button onClick={onClose} type="button" 
            className="py-2.5 px-5 me-2 mb-2 rounded-xl text-sm font-medium text-gray-900 focus:outline-none
             bg-white   border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-400">Cancel</button>
            <button  onClick={handleSend} type="button" 
              className="text-gray-900 bg-white border rounded-xl   border-gray-300 focus:outline-none
             hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-white-800 dark:text-gray-800 dark:border-gray-600 dark:hover:bg-gray-400 dark:hover:border-gray-600 dark:focus:ring-gray-700">Send</button>
            </div>
        {status && <p className="mt-4 break-words  text-gray-900 dark:text-gray-200">{status}</p>}
      </div>
    </div>
  );
};

export default Modal;
