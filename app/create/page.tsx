"use client";
import React, { useState } from "react";
import Warning from "@/components/Warning";
import Phrase from "@/components/Phrase";
import Password from "@/components/Password";
import { redirect } from "next/navigation";

function Page() {
  const [currentStep, setCurrentStep] = useState(0);

  if (typeof window !== "undefined") {
    const mn = window.localStorage.getItem("mn");
    if(mn){
      redirect("/dashboard");
    }
  }
  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  return (
    <div className="flex max-h-screen  bg-background flex-col items-center justify-center ">
      {currentStep === 0 && <Warning onNext={goToNextStep} />}
      {currentStep === 1 && <Phrase onNext={goToNextStep} />}
      {currentStep === 2 && <Password/>}
    </div>
  );
}

export default Page;
