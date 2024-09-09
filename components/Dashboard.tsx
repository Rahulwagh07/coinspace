"use client";

import { useState, useEffect } from "react";
import { getEthereumBalance, getSolanaBalance } from "@/lib/transactions";
import WalletCard from "./WalletCard";
import { generateEthWallet, generateSolWallet } from "@/lib/wallet";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from 'next/navigation'
import { MnemonicDialog } from "./MnemonicDialog";
import Loader from "./Loader";

interface Wallet {
  publicKey: string;
  privateKey?: string;
  balance: number;
}

export function Dashboard() {
  const [network, setNetwork] = useState<'eth' | 'sol' | null>(null);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [ethWallets, setEthWallets] = useState<Wallet[]>([]);
  const [solWallets, setSolWallets] = useState<Wallet[]>([]);
  const [ethBalances, setEthBalances] = useState<{ [key: string]: number }>({});
  const [solBalances, setSolBalances] = useState<{ [key: string]: number }>({});
  let mnemonic = "";


  if (typeof window !== "undefined") {
    mnemonic = window.localStorage.getItem("mn") || "";
  }

  const mnemonicWords = mnemonic.split(" ");
  const router = useRouter();
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fetchWallets = async () => {
    setLoading(true);
    const storedEthWallets = JSON.parse(window.localStorage.getItem("eth_wallets") || "[]");
    setEthWallets(storedEthWallets);

    const ethBalancesTemp: { [key: string]: number } = {};
    for (const wallet of storedEthWallets) {
      try {
        const balance = await getEthereumBalance(wallet.publicKey);
        ethBalancesTemp[wallet.publicKey] = balance;
      } catch (error) {
        console.error("Error fetching ETH balance:", error);
      }
    }
    setEthBalances(ethBalancesTemp);

    const storedSolWallets = JSON.parse(window.localStorage.getItem("sol_wallets") || "[]");
    setSolWallets(storedSolWallets);

    const solBalancesTemp: { [key: string]: number } = {};
    for (const wallet of storedSolWallets) {
      try {
        const balance = await getSolanaBalance(wallet.publicKey);
        solBalancesTemp[wallet.publicKey] = balance;
      } catch (error) {
        console.error("Error fetching SOL balance:", error);
      }
    }
    setLoading(false);
    setSolBalances(solBalancesTemp);
  };

  useEffect(() => {
    console.log("Transaction Success Updated:", transactionSuccess);
    fetchWallets();
  }, [transactionSuccess]);

  const handleGenerateWallet = async () => {
    if (!mnemonic) {
      toast.success("Mnemonic not found");
      router.push("/");
      return;
    }
    if(!network){
      alert("Plase choose Blockchain");
      setShowWalletOptions(true);
      return;
    }
    if (network === 'eth') {
      try {
        await generateEthWallet(mnemonic);
        toast.success("ETH Wallet created successfully!");
        setShowWalletOptions(false);
        fetchWallets();
      } catch (error) {
        console.log("Error creating ETH wallet", error);
      }
    } else if (network === 'sol') {
      try {
        await generateSolWallet(mnemonic);
        toast.success("Solana Wallet created successfully!");
        setShowWalletOptions(false);
        fetchWallets();
      } catch (error) {
        console.log("Error creating SOL wallet", error);
      }
    }
    setShowWalletOptions(false);
  };

  const deleteWallet = (type: 'eth' | 'sol', publicKey: string) => {
    let updatedWallets: Wallet[];

    if (type === 'eth') {
      updatedWallets = ethWallets.filter(wallet => wallet.publicKey !== publicKey);
      window.localStorage.setItem('eth_wallets', JSON.stringify(updatedWallets));
      setEthWallets(updatedWallets);
    } else if (type === 'sol') {
      updatedWallets = solWallets.filter(wallet => wallet.publicKey !== publicKey);
      window.localStorage.setItem('sol_wallets', JSON.stringify(updatedWallets));
      setSolWallets(updatedWallets);
    }

    toast.success(`${type.toUpperCase()} Wallet deleted successfully!`);
  };

  if(loading){
    return  <Loader/>;
  }

  return (
    <div className="flex flex-col w-9/12 mx-auto items-center justify-center border rounded-xl border-slate-800 p-4">
      <div className="flex justify-between w-10/12 p-4"> 
        {
          mnemonicWords && <MnemonicDialog mnemonicWords={mnemonicWords}/>
        }
      
        <Button
          className="border rounded-xl w-[10%]"
          onClick={() => setShowWalletOptions(true)}
        >
          Add Wallet
        </Button>
      </div>
      
      <div className="container py-4 lg:w-10/12">
        <div>
          {solWallets.map((wallet, index) => (
            <WalletCard
              key={`sol-${wallet.publicKey}`}
              type="SOL"
              wallet={wallet}
              balance={solBalances[wallet.publicKey] || 0}
              onDelete={(publicKey) => deleteWallet('sol', publicKey)}
              index={index}
              setTransactionSuccess={setTransactionSuccess}
            />
          ))}
          {ethWallets.map((wallet, index) => (
            <WalletCard
              key={`eth-${wallet.publicKey}`}
              type="ETH"
              wallet={wallet}
              balance={ethBalances[wallet.publicKey] || 0}
              onDelete={(publicKey) => deleteWallet('eth', publicKey)}
              index={index}
              setTransactionSuccess={setTransactionSuccess}
            />
          ))}
        </div>
      </div>

      {showWalletOptions && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-700 p-12 rounded-xl border">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Select Blockchain</h3>
            <p className="text-lg  dark:text-gray-300 mb-4">
              Choose the Blockchain for which you want to create a wallet.
            </p>
            <div className="grid gap-4 mb-4">
              <span
                onClick={() => setNetwork('eth')}
                className={`flex cursor-pointer font-semibold items-center justify-center border gap-4 p-2 bg-blue-600
                            rounded-xl ${network === "eth" && "text-red-400"} `}
              >
                Ethereum
              </span>
              <span
                onClick={() => setNetwork('sol')}
                className={`flex cursor-pointer font-semibold items-center justify-center border gap-4 p-2  bg-blue-600
                  rounded-xl ${network === "sol" && "text-red-400"} `}
                >
                Solana
              </span>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Button 
                variant={"outline"} 
                onClick={() => setShowWalletOptions(false)}
                className="border rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateWallet}
                className="border rounded-xl"
              >
                Create
              </Button>
            </div>
          </div>
        </div>
        )}
    </div>
  );
}
