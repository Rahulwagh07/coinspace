import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

const getAndIncrementCounter = (key: string): number => {
  const current = parseInt(localStorage.getItem(key) || "0", 10);
  const next = current + 1;
  localStorage.setItem(key, next.toString());
  return current;
};

export async function generateEthWallet(mnemonic: string) {
  const seed = await mnemonicToSeed(mnemonic);
  const counter = getAndIncrementCounter("eth_counter");
  const derivationPath = `m/44'/60'/0'/${counter}/0`;  
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(derivationPath);
  const privateKey = child.privateKey;
  const wallet = new Wallet(privateKey);

  const ethWallets = JSON.parse(localStorage.getItem("eth_wallets") || "[]");
  ethWallets.push({
    publicKey: wallet.address,
    privateKey: privateKey
  });
  localStorage.setItem("eth_wallets", JSON.stringify(ethWallets));
}

export async function generateSolWallet(mnemonic: string) {
  try {
    const seed = await mnemonicToSeed(mnemonic);
    const counter = getAndIncrementCounter('sol_counter');
    const path = `m/44'/501'/${counter}'/0'`; 
    const derivedSeed = derivePath(path, seed.toString('hex')).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret);
    const solWallets = JSON.parse(localStorage.getItem('sol_wallets') || '[]');
    solWallets.push({
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex')
    });
    localStorage.setItem('sol_wallets', JSON.stringify(solWallets));
  } catch (error) {
    console.error('Error creating Solana wallet:', error);
  }
}