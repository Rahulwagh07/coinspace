"use client"
import { Dashboard } from "@/components/Dashboard";
import { redirect } from "next/navigation";

export default function Hero() {
  if (typeof window !== "undefined") {
    const mn = window.localStorage.getItem("mn");
    if(!mn){
      redirect("/");
    }
  }
  
  return (
    <div className="relative overflow-hidden py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="flex absolute -z-10 -top-[35rem] start-1/2 transform -translate-x-1/2"
    >
      <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
      <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
    </div>
      <Dashboard/> 
  </div>
  );
}
