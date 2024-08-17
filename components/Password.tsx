"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Password() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setErrorMessage("");
    router.push("/dashboard");
  };

  return (
    <div className="relative overflow-hidden flex items-center justify-center">
      <div className="container lg:w-10/12 py-24 lg:py-32">
        <div className="text-center">
          <h3 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl">
            Create a Password
          </h3>
          <p className="mt-3 text-xl text-muted-foreground">
            It should be at least 8 characters.
            You’ll need this to unlock Wallet.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 mt-4">
            <div className="relative w-full">
              <input
                type="password"  
                placeholder="Password"
                required
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-4 mb-4 text-lg border border-gray-300 rounded-xl bg-gray-50 dark:bg-neutral-700 dark:text-white dark:border-blue-600"
              />
            </div>
            <div className="relative w-full">
              <input
                type="password"  
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full p-4 mb-4 text-lg border border-gray-300 rounded-xl bg-gray-50 dark:bg-neutral-700 dark:text-white dark:border-blue-600"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500">{errorMessage}</p>
            )}
            <Button
              type="submit"
              size={"lg"}
              className="px-28 py-4 text-lg font-semibold border rounded-xl"
            >
              Next
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
