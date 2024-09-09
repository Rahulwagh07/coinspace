import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";

export function MnemonicDialog({ mnemonicWords }: { mnemonicWords: string[] }) {

  const [buttonText, setButtonText] = useState('Copy');
  const handleCopy = () => {
    navigator.clipboard.writeText(mnemonicWords.toString());
    setButtonText('Copied');  
    setTimeout(() => {
      setButtonText('Copy');
    }, 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Secret Phase</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-12">
        <DialogHeader>
          <DialogTitle>Your Recovery Phrase</DialogTitle>
          <DialogDescription>
           Use these 12 words to recover your wallet.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4  font-medium mt-2">
            {mnemonicWords.map((word, index) => (
              <div key={index} className="flex items-center justify-center p-2 bg-gray-200 rounded dark:bg-neutral-700">
                {index + 1}. {word}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCopy} >
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
