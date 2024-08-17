"use client";
import React, { useState } from "react";
import Warning from "@/components/Warning";
import Phrase from "@/components/Phrase";
import Password from "@/components/Password";
import Redirect from "@/components/Redirect";

function Page() {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  return (
    <div className="flex max-h-screen  bg-background flex-col items-center justify-center ">
      <Redirect/>
      {currentStep === 0 && <Warning onNext={goToNextStep} />}
      {currentStep === 1 && <Phrase onNext={goToNextStep} />}
      {currentStep === 2 && <Password/>}
    </div>
  );
}

export default Page;
