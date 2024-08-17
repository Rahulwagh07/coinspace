"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { generateMnemonic } from "bip39";
import toast from "react-hot-toast";

export default function Phrase({ onNext }) {
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [read, setRead] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mn = generateMnemonic();
    const mnemonicWords = mn.split(" ");
    setMnemonic(mnemonicWords);
    setLoading(false);
    localStorage.setItem("mn", mn);
  }, []);

  const copyToClipboard = () => {
    try{
      navigator.clipboard.writeText(mnemonic.join(" "));
      toast.success("Secret Phase copied to clipboard!");
    } catch(error){
      console.log(error);
    }
  }
   
  return (
    <div className="relative overflow-hidden flex items-center justify-center">
      <div className="lg:w-10/12 py-24 lg:py-12">
        <div className="text-center">
          <h3 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-5xl">
            Secret Recovery Phrase
          </h3>
          <p className="mt-3 text-xl text-muted-foreground">
            Save these words in a safe place.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <div className="flex justify-center cursor-pointer mt-8"
            onClick={() => copyToClipboard()}>
              <div className="grid grid-cols-3 gap-4 text-lg font-medium text-gray-900 dark:text-gray-300">
                {!loading &&
                  mnemonic.map((word, index) => (
                    <div key={index} className="flex items-center justify-center p-2 bg-gray-200 rounded dark:bg-neutral-700">
                      {index + 1}. {word}
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => setRead(!read)}>
              <input
                type="checkbox"
                checked={read}
                readOnly
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <p className="ms-2 text-lg font-medium text-gray-900 dark:text-gray-300">
                I saved my secret recovery phrase.
              </p>
            </div>
            <Button size={"lg"} className="px-28 py-4 text-lg font-semibold border rounded-xl" disabled={!read} onClick={onNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
