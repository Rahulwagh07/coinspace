import { CreateWallet } from "@/components/CreateWallet";

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-24 lg:py-32">
       <div
        aria-hidden="true"
        className="flex absolute -top-[30rem] start-1/2 transform -translate-x-1/2"
      >
        <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
        <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
      </div>
       <CreateWallet/> 
    </div>
  );
}
