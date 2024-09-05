"use client";

import { useState, useEffect } from "react";
import { getEthereumBalance, getSolanaBalance } from "@/lib/transactions";
import WalletCard from "./WalletCard";
import { generateEthWallet, generateSolWallet } from "@/lib/wallet";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { useRouter } from 'next/navigation'
import { MnemonicDialog } from "./MnemonicDialog";

interface Wallet {
  publicKey: string;
  privateKey?: string;
  balance: number;
}

export function CreateWallet() {
  const [network, setNetwork] = useState<'eth' | 'sol' | null>(null);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false); // State for showing mnemonic
  const [ethWallets, setEthWallets] = useState<Wallet[]>([]);
  const [solWallets, setSolWallets] = useState<Wallet[]>([]);
  const [ethBalances, setEthBalances] = useState<{ [key: string]: number }>({});
  const [solBalances, setSolBalances] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  const fetchWallets = async () => {
    const storedEthWallets = JSON.parse(localStorage.getItem("eth_wallets") || "[]");
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

    const storedSolWallets = JSON.parse(localStorage.getItem("sol_wallets") || "[]");
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
    setSolBalances(solBalancesTemp);
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleGenerateWallet = async () => {
    const mnemonic = localStorage.getItem("mn") || "";
    if (!mnemonic) {
      toast.success("Mnemonic not found");
      router.push("/");
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
      localStorage.setItem('eth_wallets', JSON.stringify(updatedWallets));
      setEthWallets(updatedWallets);
    } else if (type === 'sol') {
      updatedWallets = solWallets.filter(wallet => wallet.publicKey !== publicKey);
      localStorage.setItem('sol_wallets', JSON.stringify(updatedWallets));
      setSolWallets(updatedWallets);
    }

    toast.success(`${type.toUpperCase()} Wallet deleted successfully!`);
  };

  const mnemonic = localStorage.getItem("mn") || "";
  const mnemonicWords = mnemonic.split(" ");

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
          {ethWallets.map((wallet, index) => (
            <WalletCard
              key={`eth-${wallet.publicKey}`}
              type="ETH"
              wallet={wallet}
              balance={ethBalances[wallet.publicKey] || 0}
              onDelete={(publicKey) => deleteWallet('eth', publicKey)}
              index={index}
            />
          ))}
          {solWallets.map((wallet, index) => (
            <WalletCard
              key={`sol-${wallet.publicKey}`}
              type="SOL"
              wallet={wallet}
              balance={solBalances[wallet.publicKey] || 0}
              onDelete={(publicKey) => deleteWallet('sol', publicKey)}
              index={index}
            />
          ))}
        </div>
      </div>

      {showWalletOptions && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 border rounded-lg">
          <div className="bg-white dark:bg-slate-700 p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Select Network</h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Choose the network for which you want to generate a wallet.
            </p>
            <div className="grid gap-4 mb-4">
              <span
                onClick={() => setNetwork('eth')}
                className={`flex cursor-pointer font-semibold items-center justify-center gap-4 p-2 
                            rounded-lg ${network === "eth" ? "bg-blue-100 dark:text-red-500" : "bg-gray-100 text-gray-700"}
                            dark:bg-gray-700 dark:text-gray-300`}
              >
                Ethereum
              </span>
              <span
                onClick={() => setNetwork('sol')}
                className={`flex cursor-pointer font-semibold items-center justify-center gap-4 p-2 
                    rounded-lg ${network === "sol" ? "bg-blue-100 dark:text-red-500" : "bg-gray-100 text-gray-700"}
                    dark:bg-gray-700 dark:text-gray-300`}
              >
                Solana
              </span>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowWalletOptions(false)}
                type="button"
                className="py-2.5 px-5 me-2 mb-2 rounded-xl text-sm font-medium text-gray-900 focus:outline-none 
                  bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 
                  focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 
                  dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateWallet}
                type="button"
                className="text-gray-900 bg-white border rounded-xl border-gray-300 focus:outline-none 
                    hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium text-sm px-5 py-2.5 
                    me-2 mb-2 dark:bg-white-800 dark:text-gray-800 dark:border-gray-600 
                    dark:hover:bg-gray-400 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        )}
    </div>
  );
}
