import axios from 'axios';
import { ethers } from 'ethers';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;
const ETHEREUM_RPC_URL = process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL!;

const connection = new Connection("https://api.devnet.solana.com", 'confirmed');

// Function to get Solana balance
export async function getSolanaBalance(publicKey: string): Promise<number> {
  try {
    const response = await fetch(SOLANA_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [publicKey],
      }),
    });

    const data = await response.json();
    return data.result.value / 1e9;  
  } catch (error) {
    console.error('Error fetching SOL balance:', error);
    return 0;
  }
}

// Function to get Ethereum balance
export async function getEthereumBalance(publicKey: string): Promise<number> {
  try {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBalance',
      params: [publicKey, 'latest'],
    });

    const response = await axios.post(ETHEREUM_RPC_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const balanceHex = response.data.result;
    const balance = ethers.utils.formatEther(balanceHex);
    return parseFloat(balance);
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return 0;
  }
}

function hexStringToUint8Array(hexString: string): Uint8Array {
  const len = hexString.length;
  const array = new Uint8Array(len / 2);
  for (let i = 0; i < len; i += 2) {
    array[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }
  return array;
}

export async function sendSolanaTransaction(privateKey: string, recipientPublicKey: string, amount: number): Promise<string> {
  const privateKeyUint8Array = hexStringToUint8Array(privateKey);
  const sender = Keypair.fromSecretKey(privateKeyUint8Array);

  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: new PublicKey(recipientPublicKey),
        lamports: LAMPORTS_PER_SOL * amount,
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);
    return signature;
  } catch (error) {
    console.error('Error sending SOL:', error);
    throw error;
  }
}
