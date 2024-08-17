"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";

interface Props {
  onNext: () => void;  
}

export default function Warning({ onNext } : Props) {
  const [read, setRead] = useState(false);

  return (
    <div className="relative overflow-hidden flex items-center justify-center">
      <div className=" lg:w-7/12 py-24 lg:py-12">
        <div className="text-center">
          <h3 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-5xl">
            Secret Recovery Phrase Warning
          </h3>
          <p className="mt-3 text-xl text-muted-foreground">
            On the next page, you will receive your secret recovery phrase.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <div className="flex items-center p-4 text-sm text-gray-800 border border-gray-300 rounded-xl bg-gray-50 dark:bg-[#44403c] dark:text-gray-400 dark:border-gray-600" role="alert">
               <AiOutlineWarning size={32}/>
              <p className="text-lg text-red-300">
                This is the <b>ONLY</b> way to recover your account if you lose access to your device or password.
              </p>
            </div>
            <div className="flex items-center cursor-pointer" onClick={() => setRead(!read)}>
              <input
                type="checkbox"
                checked={read}
                readOnly
                className="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 rounded  dark:bg-gray-blue-500 dark:border-gray-600"
              />
              <p className="ms-2  font-medium text-gray-900 dark:text-gray-400">
                I understand that I am responsible for saving my secret recovery phrase, and that it is the only way to recover my wallet.
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
